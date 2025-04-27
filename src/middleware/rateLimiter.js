import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import logger from '../utils/logger.js';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.connect().catch(err => logger.error('Redis Connection Error', err));

// Common rate limit configuration
const commonConfig = {
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:',
    expiry: 60 * 60 // 1 hour
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: res.getHeader('Retry-After')
    });
  }
};

// API rate limiter (general endpoints)
export const apiLimiter = rateLimit({
  ...commonConfig,
  max: 100, // 100 requests per windowMs
  message: 'Too many API requests, please try again later'
});

// Authentication rate limiter (login, register, etc.)
export const authLimiter = rateLimit({
  ...commonConfig,
  max: 5, // 5 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many authentication attempts, please try again later'
});

// Sensitive operations rate limiter (password reset, etc.)
export const sensitiveLimiter = rateLimit({
  ...commonConfig,
  max: 3, // 3 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many sensitive operations, please try again later'
});

// Search rate limiter
export const searchLimiter = rateLimit({
  ...commonConfig,
  max: 30, // 30 requests per windowMs
  message: 'Too many search requests, please try again later'
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  ...commonConfig,
  max: 10, // 10 requests per windowMs
  message: 'Too many file uploads, please try again later'
}); 