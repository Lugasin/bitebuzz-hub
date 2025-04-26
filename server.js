import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bitebuzz',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();

// Helper function to execute queries
async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BiteBuzz API' });
});

// Menu endpoints
app.get('/api/menu/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const items = await query(`
      SELECT 
        mi.*,
        r.name as restaurant_name,
        r.rating as restaurant_rating,
        mc.name as category_name
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_popular = true AND mi.is_available = true
      ORDER BY mi.rating DESC
      LIMIT ?
    `, [limit]);
    res.json(items);
  } catch (error) {
    console.error('Error fetching popular items:', error);
    res.status(500).json({ error: 'Failed to fetch popular items' });
  }
});

app.get('/api/restaurants/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const restaurants = await query(`
      SELECT 
        r.*,
        COUNT(DISTINCT mi.id) as menu_item_count,
        AVG(mi.rating) as average_item_rating
      FROM restaurants r
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id
      WHERE r.is_active = true
      GROUP BY r.id
      ORDER BY r.rating DESC, average_item_rating DESC
      LIMIT ?
    `, [limit]);
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching top restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch top restaurants' });
  }
});

app.get('/api/menu/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const items = await query(`
      SELECT 
        mi.*,
        r.name as restaurant_name,
        r.rating as restaurant_rating,
        mc.name as category_name
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_available = true
      ORDER BY mi.rating_count DESC, mi.rating DESC
      LIMIT ?
    `, [limit]);
    res.json(items);
  } catch (error) {
    console.error('Error fetching trending items:', error);
    res.status(500).json({ error: 'Failed to fetch trending items' });
  }
});

app.get('/api/menu/recommended', async (req, res) => {
  try {
    const { userId, limit } = req.query;
    const items = await query(`
      SELECT 
        mi.*,
        r.name as restaurant_name,
        r.rating as restaurant_rating,
        mc.name as category_name
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_available = true
      ORDER BY mi.rating DESC
      LIMIT ?
    `, [parseInt(limit) || 4]);
    res.json(items);
  } catch (error) {
    console.error('Error fetching recommended items:', error);
    res.status(500).json({ error: 'Failed to fetch recommended items' });
  }
});

app.get('/api/menu/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await query(`
      SELECT 
        mi.*,
        r.name as restaurant_name,
        r.rating as restaurant_rating,
        mc.name as category_name
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.category_id = ? AND mi.is_available = true
      ORDER BY mi.rating DESC
    `, [categoryId]);
    res.json(items);
  } catch (error) {
    console.error('Error fetching category items:', error);
    res.status(500).json({ error: 'Failed to fetch category items' });
  }
});

app.get('/api/menu/search', async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    const items = await query(`
      SELECT 
        mi.*,
        r.name as restaurant_name,
        r.rating as restaurant_rating,
        mc.name as category_name
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_available = true
      AND (
        mi.name LIKE ? OR
        mi.description LIKE ? OR
        r.name LIKE ? OR
        mc.name LIKE ?
      )
      ORDER BY mi.rating DESC
      LIMIT 20
    `, [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`
    ]);
    res.json(items);
  } catch (error) {
    console.error('Error searching menu items:', error);
    res.status(500).json({ error: 'Failed to search menu items' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 