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
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transactionApi = require("./api/transactionApi");
const budgetRoutes = require("./routes/budgetRoutes");
const annualGoalRoutes = require("./routes/annualGoalRoutes");

const app = express();
const router = express.Router();

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/profile-photos";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

app.use("/api/transactions", transactionApi);
app.use("/api/budgets", budgetRoutes);
app.use("/api/annual-goals", annualGoalRoutes);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: false,
  logger: false,
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendResetEmail = async (email, otp) => {
  const mailOptions = {
    from: {
      name: "Expense Manager",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: "Password Reset OTP - Expense Manager",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Password Reset OTP</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password for your Expense Manager account.</p>
        <p>Please use the following OTP to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; font-size: 32px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This OTP will expire in 5 minutes</li>
          <li>If you didn't request this reset, please ignore this email</li>
          <li>Never share this OTP with anyone</li>
        </ul>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          For security reasons, this OTP can only be used once. If you need to reset your password again, 
          please request a new OTP.
        </p>
      </div>
    `,
    text: `
      Password Reset OTP
      
      You have requested to reset your password.
      
      Your OTP is: ${otp}
      
      This OTP will expire in 5 minutes.
      
      If you didn't request this reset, please ignore this email.
      Never share this OTP with anyone.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send reset email: ${error.message}`);
  }
};

router.post("/verify-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        exists: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetPasswordToken = hashedOTP;
    user.resetPasswordExpires = Date.now() + OTP_EXPIRY_TIME;
    await user.save();

    try {
      await sendResetEmail(email, otp);

      res.json({
        exists: true,
        message: "OTP has been sent to your email",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    console.log("Received OTP verification request:", {
      email: req.body.email,
    });
    const { email, otp } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if user has a reset token
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      console.log("No active reset token found for user:", email);
      return res.status(400).json({
        message: "No active OTP found. Please request a new one.",
      });
    }

    // Verify OTP expiration
    if (Date.now() > user.resetPasswordExpires) {
      console.log("OTP expired for user:", email);
      // Clear expired token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Verify OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOTP !== user.resetPasswordToken) {
      console.log("Invalid OTP provided for user:", email);
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP is valid - don't clear the token yet as it's needed for password reset
    console.log("OTP verified successfully for user:", email);
    res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedOTP,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
});

// Register the router
app.use("/api", router);

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
