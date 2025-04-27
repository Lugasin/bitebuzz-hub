import express from 'express';
import OrderService from '../services/orderService.js';
import { authenticateUser, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const orderService = new OrderService();

// Create a new order
router.post('/', authenticateUser, async (req, res) => {
  try {
    const orderData = req.body;
    orderData.customerId = req.user.id;
    const { orderId, order } = await orderService.createOrder(orderData);
    res.status(201).json({ orderId, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:orderId', authenticateUser, async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update order status
router.patch('/:orderId/status', authenticateUser, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      status,
      req.user.id,
      req.user.role
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get available orders for drivers
router.get('/available', authenticateUser, authorizeRole('driver'), async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    const orders = await orderService.getAvailableOrders(location, radius);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get driver's orders
router.get('/driver/orders', authenticateUser, authorizeRole('driver'), async (req, res) => {
  try {
    const orders = await orderService.getDriverOrders(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Subscribe to order updates
router.get('/:orderId/subscribe', authenticateUser, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.getOrderById(orderId);
    
    // Check if user has permission to view this order
    if (req.user.role !== 'admin' && 
        req.user.id !== order.customerId && 
        req.user.id !== order.driverId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const unsubscribe = orderService.subscribeToOrderUpdates(orderId, (updatedOrder) => {
      res.write(`data: ${JSON.stringify(updatedOrder)}\n\n`);
    });

    req.on('close', () => {
      unsubscribe();
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 