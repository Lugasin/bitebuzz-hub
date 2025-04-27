import mysql from 'mysql2/promise';
import logger from '../utils/logger.js';

// Create the connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'e_eats',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    logger.info('Database connection established');
    connection.release();
  })
  .catch(error => {
    logger.error('Database connection failed:', error);
    process.exit(1);
  });

// Handle connection errors
pool.on('error', (err) => {
  logger.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    logger.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    logger.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    logger.error('Database connection was refused.');
  }
}); 