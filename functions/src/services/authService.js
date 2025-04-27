import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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

const API_BASE_URL = 'http://localhost:3000/api';

class AuthService {
  static async register(userData) {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const token = await userCredential.user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
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