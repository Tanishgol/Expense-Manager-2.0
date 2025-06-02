require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./DBconnection");
const bcrypt = require("bcryptjs");
const User = require("./model/register");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transactionApi = require("./api/transactionApi");
const budgetRoutes = require("./routes/budgetRoutes");
const annualGoalRoutes = require('./routes/annualGoalRoutes');

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/profile-photos';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

app.use("/api/transactions", transactionApi);
app.use("/api/budgets", budgetRoutes);
app.use("/api/annual-goals", annualGoalRoutes);

// Email configuration with detailed options
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true, // Enable debug logging
  logger: true // Enable logger
});

// Verify email configuration on server start
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Enhanced email sending function with better error handling
const sendResetEmail = async (email, resetToken) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: {
      name: 'Expense Manager',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: 'Password Reset Request - Expense Manager',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password for your Expense Manager account.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #059669; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This link will expire in 1 hour</li>
          <li>If you didn't request this reset, please ignore this email</li>
        </ul>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          For security reasons, this link can only be used once. If you need to reset your password again, 
          please request a new link.
        </p>
      </div>
    `,
    text: `
      Password Reset Request
      
      You have requested to reset your password.
      
      Please click the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request this reset, please ignore this email.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send reset email: ${error.message}`);
  }
};

app.post("/api/verify-email", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        exists: false,
        message: "Email not found" 
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    try {
      await sendResetEmail(email, resetToken);
      
      res.json({ 
        exists: true,
        message: "Password reset instructions sent to your email"
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Cleanup the token if email fails
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      return res.status(500).json({
        message: "Failed to send reset email. Please try again later.",
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      message: "Error processing request",
      error: error.message 
    });
  }
});

app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      message: "Password reset successful"
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message
    });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});