import { sanitize } from 'express-validator';
import xss from 'xss';
import logger from '../utils/logger.js';

// Custom XSS options
const xssOptions = {
  whiteList: {
    a: ['href', 'title', 'target'],
    img: ['src', 'alt'],
    p: [],
    br: [],
    strong: [],
    em: [],
    ul: [],
    ol: [],
    li: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: []
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script']
};

// Sanitize request body
export const sanitizeBody = (req, res, next) => {
  try {
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = xss(req.body[key], xssOptions);
        }
      });
    }
    next();
  } catch (error) {
    logger.error('Body sanitization error:', error);
    next(error);
  }
};

// Sanitize query parameters
export const sanitizeQuery = (req, res, next) => {
  try {
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = xss(req.query[key], xssOptions);
        }
      });
    }
    next();
  } catch (error) {
    logger.error('Query sanitization error:', error);
    next(error);
  }
};

// Sanitize URL parameters
export const sanitizeParams = (req, res, next) => {
  try {
    if (req.params) {
      Object.keys(req.params).forEach(key => {
        if (typeof req.params[key] === 'string') {
          req.params[key] = xss(req.params[key], xssOptions);
        }
      });
    }
    next();
  } catch (error) {
    logger.error('Params sanitization error:', error);
    next(error);
  }
};

// Sanitize headers
export const sanitizeHeaders = (req, res, next) => {
  try {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-auth-token'];
    sensitiveHeaders.forEach(header => {
      if (req.headers[header]) {
        req.headers[header] = xss(req.headers[header], xssOptions);
      }
    });
    next();
  } catch (error) {
    logger.error('Headers sanitization error:', error);
    next(error);
  }
};

// Combined sanitization middleware
export const sanitizeAll = [
  sanitizeBody,
  sanitizeQuery,
  sanitizeParams,
  sanitizeHeaders
]; 