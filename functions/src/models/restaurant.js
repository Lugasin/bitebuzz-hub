const pool = require('../config/database');

const Restaurant = {
  getAllRestaurants: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM restaurants');
      return rows;
    } catch (error) {
      console.error('Error getting all restaurants:', error);
      throw error;
    }
  },

  getRestaurantById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM restaurants WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error getting restaurant by id:', error);
      throw error;
    }
  },
};

module.exports = Restaurant;