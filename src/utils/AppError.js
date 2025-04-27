export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'APP_ERROR';
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
export const errors = {
  // Authentication errors (4xx)
  UNAUTHORIZED: (message = 'Unauthorized') => new AppError(message, 401, 'UNAUTHORIZED'),
  FORBIDDEN: (message = 'Forbidden') => new AppError(message, 403, 'FORBIDDEN'),
  NOT_FOUND: (message = 'Resource not found') => new AppError(message, 404, 'NOT_FOUND'),
  VALIDATION_ERROR: (message = 'Validation failed') => new AppError(message, 422, 'VALIDATION_ERROR'),
  RATE_LIMIT_EXCEEDED: (message = 'Too many requests') => new AppError(message, 429, 'RATE_LIMIT_EXCEEDED'),

  // Server errors (5xx)
  INTERNAL_ERROR: (message = 'Internal server error') => new AppError(message, 500, 'INTERNAL_ERROR'),
  SERVICE_UNAVAILABLE: (message = 'Service unavailable') => new AppError(message, 503, 'SERVICE_UNAVAILABLE'),

  // Business logic errors
  INSUFFICIENT_BALANCE: (message = 'Insufficient balance') => new AppError(message, 400, 'INSUFFICIENT_BALANCE'),
  ORDER_ALREADY_PROCESSED: (message = 'Order already processed') => new AppError(message, 400, 'ORDER_ALREADY_PROCESSED'),
  PRODUCT_OUT_OF_STOCK: (message = 'Product out of stock') => new AppError(message, 400, 'PRODUCT_OUT_OF_STOCK'),
  INVALID_PROMO_CODE: (message = 'Invalid promo code') => new AppError(message, 400, 'INVALID_PROMO_CODE'),
  PAYMENT_FAILED: (message = 'Payment failed') => new AppError(message, 400, 'PAYMENT_FAILED')
}; 