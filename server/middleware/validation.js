const { body, validationResult } = require('express-validator');
const xss = require('xss');

// Sanitize and validate input data
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key].trim());
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key].trim());
      }
    });
  }

  next();
};

// Validation rules for transactions
const validateTransaction = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .escape(),
  
  body('amount')
    .isFloat({ min: -999999999, max: 999999999 })
    .withMessage('Amount must be a valid number between -999,999,999 and 999,999,999'),
  
  body('category')
    .isIn(['Food', 'Housing', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Personal Care', 'Other', 'Income'])
    .withMessage('Invalid category'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      // Allow dates up to 1 year in the future for planning purposes
      const maxFutureDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      
      if (date > maxFutureDate) {
        throw new Error('Date cannot be more than 1 year in the future');
      }
      return true;
    }),
  
  body('vendor')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Vendor must be less than 100 characters')
    .escape(),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .escape(),
];

// Validation rules for user registration
const validateRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 225 })
    .withMessage('Full name must be between 2 and 225 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces')
    .escape(),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

// Validation rules for login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Validation rules for password reset
const validatePasswordReset = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be exactly 6 digits'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

// Check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  sanitizeInput,
  validateTransaction,
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  handleValidationErrors
};
