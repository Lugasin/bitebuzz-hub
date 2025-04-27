import Joi from 'joi';
import { AppError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body, query, and params
      const { error } = schema.validate({
        body: req.body,
        query: req.query,
        params: req.params
      }, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorMessage = error.details
          .map(detail => detail.message)
          .join(', ');
        
        logger.warn('Validation error', {
          path: req.path,
          method: req.method,
          errors: error.details
        });

        throw new AppError(400, errorMessage);
      }

      // Sanitize input
      if (req.body) {
        Object.keys(req.body).forEach(key => {
          if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
          }
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Common validation schemas
export const schemas = {
  // User validation schemas
  register: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required(),
      name: Joi.string().min(2).max(50).required(),
      role: Joi.string().valid('user', 'admin').default('user')
    })
  }),

  login: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }),

  // Product validation schemas
  createProduct: Joi.object({
    body: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      description: Joi.string().min(10).max(1000).required(),
      price: Joi.number().min(0).required(),
      category: Joi.string().required(),
      stock: Joi.number().integer().min(0).required()
    })
  }),

  // Order validation schemas
  createOrder: Joi.object({
    body: Joi.object({
      items: Joi.array().items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required()
        })
      ).min(1).required(),
      shippingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required()
      }).required()
    })
  }),

  // Pagination and filtering
  pagination: Joi.object({
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sort: Joi.string().valid('asc', 'desc').default('desc'),
      search: Joi.string().allow('').default('')
    })
  })
}; 