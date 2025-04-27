const API_BASE_URL = 'http://localhost:3000/api';

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

export class User {
  static async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/email/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getUsersByRole(role) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/role/${role}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
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