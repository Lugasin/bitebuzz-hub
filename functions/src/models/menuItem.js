const pool = require('../config/database');

class MenuItem {
  static async getAllMenuItems() {
    try {
      const [rows] = await pool.query('SELECT * FROM menu_items');
      return rows;
    } catch (error) {
      console.error('Error getting all menu items:', error);
      throw error;
    }
  }

  static async getMenuItemById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error getting menu item by id:', error);
      throw error;
    }
  }
}

module.exports = MenuItem;