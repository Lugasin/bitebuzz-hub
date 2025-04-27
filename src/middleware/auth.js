import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import logger from '../utils/logger.js';
import { pool } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication token is required', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      throw new AppError('User account is deactivated', 403);
    }

    // Check if account is locked
    if (user.account_locked_until && user.account_locked_until > new Date()) {
      throw new AppError('Account is temporarily locked. Please try again later.', 403);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      is_active: user.is_active,
      two_factor_enabled: user.two_factor_enabled
    };

    // Log successful authentication
    logger.info(`User ${user.id} authenticated successfully`);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Unauthorized - Insufficient permissions', 403);
    }
    next();
  };
};

export const checkOwnership = (model, idField = 'id') => {
  return async (req, res, next) => {
    try {
      const [items] = await pool.query(
        `SELECT * FROM ${model} WHERE ${idField} = ?`,
        [req.params.id]
      );

      if (items.length === 0) {
        throw new AppError(`${model} not found`, 404);
      }

      const item = items[0];

      // Allow access if user is admin or owns the resource
      if (req.user.role !== 'admin' && item.user_id !== req.user.id) {
        throw new AppError('Unauthorized - You do not own this resource', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 