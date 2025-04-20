const express = require('express');
const router = express.Router();
const Restaurant = require('../../models/restaurant');

router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    console.error('Error getting all restaurants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;