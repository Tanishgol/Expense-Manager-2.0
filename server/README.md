# Expense Manager 2.0 - Backend Server

A secure and robust backend API for the Expense Manager 2.0 application.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with proper token validation
- **Input Validation**: Comprehensive input sanitization and validation
- **Rate Limiting**: Protection against API abuse
- **Security Headers**: Protection against common web vulnerabilities
- **File Upload Security**: Secure image upload with validation
- **Comprehensive Logging**: Request/response logging and error tracking
- **Pagination**: Efficient data retrieval with pagination support
- **Export Functionality**: CSV, Excel, and PDF export capabilities

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Expense-Manager-2.0/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/expense-manager
   
   # JWT Configuration (REQUIRED - No fallback allowed)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Email Configuration (for password reset functionality)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Server Configuration
   PORT=9000
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   
   # Environment
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with expiration handling
- Secure password hashing with bcrypt
- Token validation middleware
- Rate limiting on authentication endpoints

### Input Validation & Sanitization
- XSS protection with input sanitization
- Comprehensive validation rules for all endpoints
- SQL injection prevention
- File upload security with MIME type and extension validation

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer Policy

### Rate Limiting
- General API rate limiting (100 requests per 15 minutes)
- Stricter authentication rate limiting (5 requests per 15 minutes)
- File upload rate limiting (10 uploads per hour)

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/verify-email` - Send password reset OTP
- `POST /api/verify-otp` - Verify OTP
- `POST /api/reset-password` - Reset password

### Transactions
- `GET /api/transactions` - Get all transactions (with pagination)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get specific transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/export` - Export transactions (CSV/Excel/PDF)

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Annual Goals
- `GET /api/annual-goals` - Get all annual goals
- `POST /api/annual-goals` - Create new annual goal
- `PUT /api/annual-goals/:id` - Update annual goal
- `DELETE /api/annual-goals/:id` - Delete annual goal

## 🛠️ Development

### Project Structure
```
server/
├── middleware/          # Middleware functions
│   ├── auth.js         # Authentication middleware
│   ├── validation.js   # Input validation
│   ├── rateLimit.js    # Rate limiting
│   ├── logger.js       # Logging
│   └── security.js     # Security headers
├── model/              # Database models
├── routes/             # API routes
├── controller/         # Business logic
├── services/           # Data access layer
├── logs/               # Application logs
└── uploads/            # File uploads
```

### Logging
- Request/response logs are stored in `logs/YYYY-MM-DD.log`
- Error logs are stored in `logs/errors-YYYY-MM-DD.log`
- Console output for real-time monitoring

### Environment Variables
All required environment variables are validated at startup. The application will exit if any required variables are missing.

## 🚨 Security Considerations

1. **JWT Secret**: Always use a strong, unique JWT secret
2. **Database**: Use MongoDB with proper authentication
3. **Email**: Use app-specific passwords for email services
4. **CORS**: Configure CORS origin to match your frontend URL
5. **Environment**: Set NODE_ENV=production in production

## 📝 License

This project is licensed under the ISC License.
