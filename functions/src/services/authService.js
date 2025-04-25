import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import mysql from 'mysql2/promise';

const dbPool = mysql.createPool({
  host: process.env.VITE_MYSQL_HOST,
  user: process.env.VITE_MYSQL_USER,
  password: process.env.VITE_MYSQL_PASSWORD,
  database: process.env.VITE_MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

class AuthService {
  static async register(userData) {
    try {
      const { email, password, name, role } = userData;
      
      // Check if user already exists
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = await User.createUser({
        ...userData,
        password: hashedPassword
      });

      return userId;
    } catch (error) {
      console.error('Error in registration:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const user = await User.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          role: user.role,
          email: user.email
        },
        process.env.VITE_JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store session
      await dbPool.query(
        'INSERT INTO user_sessions (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))',
        [user.id, token]
      );

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  static async logout(token) {
    try {
      await dbPool.query('DELETE FROM user_sessions WHERE token = ?', [token]);
      return true;
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.VITE_JWT_SECRET);
      
      // Check if session exists and is not expired
      const [sessions] = await dbPool.query(
        'SELECT * FROM user_sessions WHERE token = ? AND expires_at > NOW()',
        [token]
      );

      if (!sessions.length) {
        throw new Error('Invalid or expired session');
      }

      return decoded;
    } catch (error) {
      console.error('Error in token verification:', error);
      throw error;
    }
  }

  static async checkPermission(userId, requiredPermission) {
    try {
      const user = await User.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return User.hasPermission(user.role, requiredPermission);
    } catch (error) {
      console.error('Error checking permission:', error);
      throw error;
    }
  }

  static async logActivity(userId, action, details, ipAddress) {
    try {
      await dbPool.query(
        'INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
        [userId, action, details, ipAddress]
      );
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }
}

export default AuthService; 