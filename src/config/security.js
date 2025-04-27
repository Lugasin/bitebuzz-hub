export const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Password Configuration
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 10,
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // Security Headers
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  },

  // File Upload Configuration
  fileUpload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ],
    uploadDir: 'uploads',
  },

  // Database Configuration
  database: {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production',
  },
};

// Logging configuration
export const logging = {
  level: process.env.LOG_LEVEL || 'info',
  console: {
    level: process.env.CONSOLE_LOG_LEVEL || 'info',
    format: 'pretty'
  },
  file: {
    enabled: process.env.FILE_LOGGING_ENABLED === 'true',
    path: process.env.LOG_PATH || 'logs',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_MAX_FILES || '14d',
    compression: process.env.LOG_COMPRESSION === 'true'
  },
  error: {
    enabled: process.env.ERROR_LOGGING_ENABLED === 'true',
    path: process.env.ERROR_LOG_PATH || 'logs/errors',
    maxSize: process.env.ERROR_LOG_MAX_SIZE || '20m',
    maxFiles: process.env.ERROR_LOG_MAX_FILES || '30d'
  },
  audit: {
    enabled: process.env.AUDIT_LOGGING_ENABLED === 'true',
    path: process.env.AUDIT_LOG_PATH || 'logs/audit',
    maxSize: process.env.AUDIT_LOG_MAX_SIZE || '20m',
    maxFiles: process.env.AUDIT_LOG_MAX_FILES || '90d'
  }
}; 