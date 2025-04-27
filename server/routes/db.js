import express from 'express';
import mysql from 'mysql2/promise';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100 // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
router.use(limiter);

// Menu routes
router.get('/menu/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [items] = await pool.query(`
      SELECT mi.*, r.name as restaurant_name, r.image_url as restaurant_image
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE mi.is_available = true
      ORDER BY mi.rating DESC
      LIMIT ?
    `, [limit]);
    res.json(items);
  } catch (error) {
    console.error('Error fetching popular items:', error);
    res.status(500).json({ error: 'Failed to fetch popular items' });
  }
});

// Restaurant routes
router.get('/restaurants/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [restaurants] = await pool.query(`
      SELECT * FROM restaurants
      ORDER BY rating DESC
      LIMIT ?
    `, [limit]);
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching top restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch top restaurants' });
  }
});

// Category routes
router.get('/menu/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router; 