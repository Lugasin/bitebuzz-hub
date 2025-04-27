export const loggingConfig = {
  // General logging settings
  level: process.env.LOG_LEVEL || 'info',
  console: {
    level: process.env.CONSOLE_LOG_LEVEL || 'info',
    format: 'pretty'
  },

  // File logging settings
  file: {
    enabled: process.env.FILE_LOGGING_ENABLED === 'true',
    path: process.env.LOG_PATH || 'logs',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    compression: process.env.LOG_COMPRESSION === 'true'
  },

  // Error logging settings
  error: {
    enabled: process.env.ERROR_LOGGING_ENABLED === 'true',
    path: process.env.ERROR_LOG_PATH || 'logs/errors',
    maxSize: process.env.ERROR_LOG_MAX_SIZE || '20m',
    maxFiles: process.env.ERROR_LOG_MAX_FILES || '30d'
  },

  // Audit logging settings
  audit: {
    enabled: process.env.AUDIT_LOGGING_ENABLED === 'true',
    path: process.env.AUDIT_LOG_PATH || 'logs/audit',
    maxSize: process.env.AUDIT_LOG_MAX_SIZE || '20m',
    maxFiles: process.env.AUDIT_LOG_MAX_FILES || '90d'
  },

  // Log rotation settings
  rotation: {
    enabled: true,
    pattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    maxSize: '20m',
    zippedArchive: true
  },

  // Log format settings
  format: {
    timestamp: 'YYYY-MM-DD HH:mm:ss',
    json: true,
    colorize: true,
    prettyPrint: true
  },

  // Log metadata
  metadata: {
    service: process.env.SERVICE_NAME || 'e-eats',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0'
  }
}; 