import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.VITE_MYSQL_HOST,
  user: process.env.VITE_MYSQL_USER,
  password: process.env.VITE_MYSQL_PASSWORD,
  database: process.env.VITE_MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export { pool }; 