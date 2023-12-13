const winston = require('winston');
const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define custom log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define your custom log format with colorization
const myFormat = combine(
  colorize({ all: true }), // Add colorization for all log levels
  timestamp(),
  printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Create a log file and console logger
const logger = winston.createLogger({
  levels: logLevels,
  format: myFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }), // Log to app.log file
  ],
});
logger.level = process.env.WINDOWS_CLOUD_LOG_LEVEL | "debug";

// Optionally, you can log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
});

// Optionally, you can log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

// Handle application shutdown gracefully
process.on('SIGINT', () => {
  logger.info('Received SIGINT. Closing the application gracefully.');
  process.exit(0);
});

module.exports = logger;