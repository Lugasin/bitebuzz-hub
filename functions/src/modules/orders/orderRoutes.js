const express = require('express');
const router = express.Router();
const Order = require('../../models/order');

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
