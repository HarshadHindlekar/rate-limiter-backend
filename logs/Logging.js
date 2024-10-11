const fs = require('fs');
const path = require('path'); 

// Logging Middleware
const logMessage = (ip, phoneNumber, status, message) => {
  const logMsg = `${new Date().toISOString()} - IP: ${ip}, Phone: ${phoneNumber}, Status: ${status}, Message: ${message}\n`;
  const logFilePath = path.join(__dirname, 'logs.txt');

  fs.appendFile(logFilePath, logMsg, (err) => {
    if (err) {
      console.error('Error writing to log file', err);
    }
  });
};

module.exports = logMessage;
