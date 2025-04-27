import winston from 'winston';
import { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = format;

// Custom format for log messages
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        logFormat
      )
    }),
    // File transport for all logs
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    }),
    // File transport for security logs
    new DailyRotateFile({
      filename: 'logs/security-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'info'
    }),
    // File transport for errors
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error'
    })
  ]
});

// Add request logging method
export const logRequest = (req: any, res: any, next: () => void) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    logger.info('Request completed', {
      method,
      url,
      ip,
      statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

// Add error logging method
export const logError = (error: Error, req?: any) => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    ...(req && {
      method: req.method,
      url: req.url,
      ip: req.ip
    })
  });
};

export { logger }; 