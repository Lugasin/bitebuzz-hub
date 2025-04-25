import mysql from 'mysql2/promise';

const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'e_eats',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

class User {
  static async getAllUsers() {
    try {
      const [rows] = await dbPool.query('SELECT * FROM users');
      return rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
  static async getUserById(id) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  }
}

export default User;