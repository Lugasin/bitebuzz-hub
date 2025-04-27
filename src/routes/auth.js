import express from 'express';
import { validateRequest } from '../middleware/validator.js';
import { schemas } from '../middleware/validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import SecurityLogger from '../services/securityLogger.js';

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authLimiter);

// Login route
router.post('/login', validateRequest(schemas.user.login), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      await SecurityLogger.logLoginAttempt(null, false, {
        email,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      throw new AppError('Invalid credentials', 401);
    }

    const user = users[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await SecurityLogger.logLoginAttempt(user.id, false, {
        email,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
      throw new AppError('Invalid credentials', 401);
    }

    // Check if account is locked
    if (user.account_locked_until && user.account_locked_until > new Date()) {
      throw new AppError('Account is temporarily locked. Please try again later.', 403);
    }

    // Reset failed attempts on successful login
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Store refresh token
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    // Log successful login
    await SecurityLogger.logLoginAttempt(user.id, true, {
      email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Register route
router.post('/register', validateRequest(schemas.user.register), async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role]
    );

    // Generate tokens
    const accessToken = jwt.sign(
      { id: result.insertId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: result.insertId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Store refresh token
    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [result.insertId, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    // Log successful registration
    await SecurityLogger.logSecurityEvent(result.insertId, 'registration', 'success', {
      email,
      role,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: result.insertId,
        email,
        name,
        role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token route
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in database
    const [tokens] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
      [refreshToken, decoded.id]
    );

    if (tokens.length === 0) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Get user
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = users[0];

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Log token refresh
    await SecurityLogger.logTokenRefresh(user.id, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

// Logout route
router.post('/logout', authenticateToken, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }

    // Log successful logout
    await SecurityLogger.logSecurityEvent(req.user.id, 'logout', 'success', {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

export default router; 