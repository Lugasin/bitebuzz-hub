import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bitebuzz',
  port: process.env.DB_PORT || 3306
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Test the connection when the server starts
testConnection();

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BiteBuzz API!' });
});

// Get popular items
app.get('/api/menu/popular', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
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
      LIMIT 10
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching popular items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top restaurants
app.get('/api/restaurants/top', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        r.*,
        COUNT(DISTINCT mi.id) as menu_item_count,
        AVG(mi.rating) as average_item_rating
      FROM restaurants r
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id
      WHERE r.is_active = true
      GROUP BY r.id
      ORDER BY r.rating DESC, average_item_rating DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching top restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get menu categories
app.get('/api/menu/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM menu_categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 