const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logger middleware
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.userId || 'anonymous'
  };
  
  console.log(`[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} - IP: ${logEntry.ip}`);
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logEntry.statusCode = res.statusCode;
    logEntry.duration = duration;
    
    // Write to log file
    const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFile(logFile, logLine, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
      }
    });
    
    // Console output for errors
    if (res.statusCode >= 400) {
      console.error(`[ERROR] ${logEntry.method} ${logEntry.url} - ${res.statusCode} (${duration}ms)`);
    } else {
      console.log(`[SUCCESS] ${logEntry.method} ${logEntry.url} - ${res.statusCode} (${duration}ms)`);
    }
  });
  
  next();
};

// Error logger
const errorLogger = (err, req, res, next) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userId: req.userId || 'anonymous',
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    }
  };
  
  // Write error to log file
  const errorLogFile = path.join(logsDir, `errors-${new Date().toISOString().split('T')[0]}.log`);
  const errorLogLine = JSON.stringify(errorLog) + '\n';
  
  fs.appendFile(errorLogFile, errorLogLine, (writeErr) => {
    if (writeErr) {
      console.error('Error writing to error log file:', writeErr);
    }
  });
  
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`);
  
  next(err);
};

module.exports = {
  logger,
  errorLogger
};
