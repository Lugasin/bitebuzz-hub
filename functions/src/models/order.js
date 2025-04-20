const pool = require('../config/database');

class Order {
  static async getAllOrders() {
    try {
      const [rows] = await pool.query('SELECT * FROM orders');
      return rows;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
      return rows[0];
    } catch (error) {
      console.error(`Error getting order by ID ${orderId}:`, error);
      throw error;
    }
  }
}

module.exports = Order;