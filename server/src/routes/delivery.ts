import express from 'express';
import { deliveryController } from '../controllers/delivery';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all delivery routes
router.use(authMiddleware);

// Driver routes
router.get('/driver/profile', deliveryController.getDriverProfile);
router.put('/driver/location', deliveryController.updateDriverLocation);
router.put('/driver/status', deliveryController.updateDriverStatus);
router.get('/driver/active-deliveries', deliveryController.getActiveDeliveries);
router.get('/driver/available-orders', deliveryController.getAvailableOrders);
router.get('/driver/recent-deliveries', deliveryController.getRecentDeliveries);
router.get('/driver/earnings', deliveryController.getDriverEarnings);
router.post('/driver/orders/:orderId/accept', deliveryController.acceptOrder);
router.post('/driver/orders/:orderId/complete', deliveryController.completeDelivery);

export const deliveryRoutes = router; 