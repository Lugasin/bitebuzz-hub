import { Request, Response, NextFunction } from 'express';
import { securityService } from '../lib/securityService';

// Input validation middleware
export const validateInput = (schema: Record<string, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { isValid, errors } = securityService.validateInput(req.body, schema);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    next();
  };
};

// Rate limiting middleware
export const rateLimit = (identifier: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { allowed, remaining, resetTime } = securityService.checkRateLimit(identifier);
    
    if (!allowed) {
      res.setHeader('X-RateLimit-Limit', '100');
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', resetTime.toString());
      
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
      });
    }
    
    next();
  };
};

// Request tracking middleware
export const trackRequest = (req: Request, res: Response, next: NextFunction) => {
  securityService.trackRequest(req, res, next);
};

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  securityService.handleError(err, req.path);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}; 