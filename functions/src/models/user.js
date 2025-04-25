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

// User roles and permissions
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  RESTAURANT_AGENT: 'restaurant_agent',
  DELIVERY_AGENT: 'delivery_agent',
  USER: 'user'
};

const PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'manage_users',
    'manage_restaurants',
    'manage_orders',
    'view_analytics',
    'manage_settings'
  ],
  RESTAURANT_AGENT: [
    'manage_restaurant_menu',
    'manage_restaurant_orders',
    'view_restaurant_analytics'
  ],
  DELIVERY_AGENT: [
    'view_delivery_orders',
    'update_order_status',
    'view_delivery_analytics'
  ],
  USER: [
    'place_orders',
    'view_orders',
    'manage_profile'
  ]
};

class User {
  static async createUser(userData) {
    try {
      const { name, email, password, role, restaurantId } = userData;
      const [result] = await dbPool.query(
        'INSERT INTO users (name, email, password, role, restaurant_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, password, role, restaurantId]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

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

  static async getUserByEmail(email) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error(`Error getting user by email ${email}:`, error);
      throw error;
    }
  }

  static async updateUser(id, userData) {
    try {
      const { name, email, role, restaurantId } = userData;
      await dbPool.query(
        'UPDATE users SET name = ?, email = ?, role = ?, restaurant_id = ? WHERE id = ?',
        [name, email, role, restaurantId, id]
      );
      return true;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      await dbPool.query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }

  static async getUsersByRole(role) {
    try {
      const [rows] = await dbPool.query('SELECT * FROM users WHERE role = ?', [role]);
      return rows;
    } catch (error) {
      console.error(`Error getting users by role ${role}:`, error);
      throw error;
    }
  }

  static hasPermission(userRole, permission) {
    if (PERMISSIONS[userRole].includes('*')) return true;
    return PERMISSIONS[userRole].includes(permission);
  }

  static getRoles() {
    return ROLES;
  }

  static getPermissions(role) {
    return PERMISSIONS[role] || [];
  }
}

export default User;