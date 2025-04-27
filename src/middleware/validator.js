import Joi from 'joi';
import { AppError } from './errorHandler.js';

// Validation schemas
export const schemas = {
  user: {
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required()
    }),
    register: Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
          'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
      role: Joi.string().valid('customer', 'vendor', 'delivery').required()
    }),
    update: Joi.object({
      name: Joi.string().min(2).max(50),
      email: Joi.string().email(),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/),
      avatar_url: Joi.string().uri()
    })
  },
  restaurant: {
    create: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      description: Joi.string().max(500),
      address: Joi.string().required(),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
      email: Joi.string().email().required(),
      logo_url: Joi.string().uri(),
      cover_image_url: Joi.string().uri(),
      opening_hours: Joi.object().pattern(
        Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        Joi.object({
          open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
          close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
        })
      ).required(),
      delivery_radius: Joi.number().min(0).default(5000),
      minimum_order_amount: Joi.number().min(0).default(0),
      delivery_fee: Joi.number().min(0).default(0)
    }),
    update: Joi.object({
      name: Joi.string().min(2).max(100),
      description: Joi.string().max(500),
      address: Joi.string(),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/),
      email: Joi.string().email(),
      logo_url: Joi.string().uri(),
      cover_image_url: Joi.string().uri(),
      opening_hours: Joi.object().pattern(
        Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        Joi.object({
          open: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        })
      ),
      delivery_radius: Joi.number().min(0),
      minimum_order_amount: Joi.number().min(0),
      delivery_fee: Joi.number().min(0)
    })
  },
  menuItem: {
    create: Joi.object({
      restaurant_id: Joi.number().required(),
      name: Joi.string().min(2).max(100).required(),
      description: Joi.string().max(500),
      price: Joi.number().min(0).required(),
      image_url: Joi.string().uri(),
      preparation_time: Joi.number().min(0),
      category: Joi.string().max(100),
      tags: Joi.array().items(Joi.string())
    }),
    update: Joi.object({
      name: Joi.string().min(2).max(100),
      description: Joi.string().max(500),
      price: Joi.number().min(0),
      image_url: Joi.string().uri(),
      preparation_time: Joi.number().min(0),
      category: Joi.string().max(100),
      tags: Joi.array().items(Joi.string())
    })
  },
  order: {
    create: Joi.object({
      restaurant_id: Joi.number().required(),
      delivery_address_id: Joi.number().required(),
      items: Joi.array().items(
        Joi.object({
          menu_item_id: Joi.number().required(),
          quantity: Joi.number().min(1).required(),
          special_instructions: Joi.string().max(500)
        })
      ).min(1).required(),
      payment_method: Joi.string().valid('cash', 'card', 'online').required(),
      special_instructions: Joi.string().max(500)
    }),
    update: Joi.object({
      status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'picked', 'delivered', 'cancelled'),
      payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded'),
      special_instructions: Joi.string().max(500)
    })
  },
  review: {
    create: Joi.object({
      order_id: Joi.number().required(),
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().max(1000),
      food_rating: Joi.number().min(1).max(5),
      delivery_rating: Joi.number().min(1).max(5),
    }),
  },
};

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      next(new AppError('Validation failed', 400, errors));
    } else {
      next();
    }
  };
}; 