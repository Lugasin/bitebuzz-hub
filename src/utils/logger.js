import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config/security.js';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    level: config.logging.console.level,
  }),

  // Error file transport
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    format,
  }),

  // Combined file transport
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format,
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  levels,
  format,
  transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Add request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url}`, {
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
    });
  });
  next();
};

// Add error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  });
  next(err);
};

// Helper methods for different log levels
export const logError = (message, meta = {}) => {
  logger.error(message, meta);
};

export const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

export const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

export const logHttp = (message, meta = {}) => {
  logger.http(message, meta);
};

export const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

// Export logger instance
export default logger; 