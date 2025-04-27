import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiLimiter, authLimiter, sensitiveLimiter, searchLimiter, uploadLimiter } from './src/middleware/rateLimiter.js';
import { securityHeaders } from './src/middleware/securityHeaders.js';
import { sanitizeAll } from './src/middleware/sanitizer.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { validateRequest, schemas } from './src/middleware/validator.js';
import { pool } from './src/config/database.js';
import logger from './src/utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(securityHeaders);
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(',') || ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/sensitive', sensitiveLimiter);
app.use('/api/search', searchLimiter);
app.use('/api/upload', uploadLimiter);

// Input sanitization
app.use(sanitizeAll);

// Middleware
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '10kb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.MAX_FILE_SIZE || '10kb' }));

// Request validation
app.use(validateRequest);

// Routes
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import restaurantRoutes from './src/routes/restaurants.js';
import orderRoutes from './src/routes/orders.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
}); 