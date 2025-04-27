import logger from '../utils/logger.js';

// Custom error class for application errors
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Default error response
  const errorResponse = {
    status: 'error',
    message: 'An unexpected error occurred'
  };

  // Development environment - include more details
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = {
      message: err.message,
      stack: err.stack
    };
  }

  // Handle specific error types
  if (err instanceof AppError) {
    errorResponse.message = err.message;
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    errorResponse.message = 'Validation Error';
    errorResponse.errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(errorResponse);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.message = 'Invalid token';
    return res.status(401).json(errorResponse);
  }

  if (err.name === 'TokenExpiredError') {
    errorResponse.message = 'Token expired';
    return res.status(401).json(errorResponse);
  }

  // Handle database errors
  if (err.code === 'ER_DUP_ENTRY') {
    errorResponse.message = 'Duplicate entry';
    return res.status(409).json(errorResponse);
  }

  // Handle rate limit errors
  if (err.statusCode === 429) {
    errorResponse.message = 'Too many requests';
    return res.status(429).json(errorResponse);
  }

  // Default error response
  res.status(500).json(errorResponse);
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found',
    code: 'NOT_FOUND'
  });
};

// Async error handler wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 