
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

interface ValidationSchema {
  params?: z.ZodObject<any>;
  query?: z.ZodObject<any>;
  body?: z.ZodObject<any>;
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request parameters if a schema is provided
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      
      // Validate query parameters if a schema is provided
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      
      // Validate request body if a schema is provided
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      
      // Validation passed, proceed to the next middleware
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format the validation errors
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        // Return a 400 Bad Request with the validation errors
        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors,
        });
      }
      
      // For unexpected errors, log and return a 500 Internal Server Error
      console.error('Validation error:', error);
      return res.status(500).json({ error: 'Internal server error during validation' });
    }
  };
};
