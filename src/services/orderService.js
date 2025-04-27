import { pool } from '../config/database.js';
import Order from '../models/order.js';
import logger from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import websocketService from './websocketService.js';

class OrderService {
  async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      const totalAmount = order.calculateTotal();
      
      // Calculate estimated distance and duration
      const { distance, duration } = await this.calculateRoute(
        order.restaurantLocation,
        order.deliveryAddress
      );

      const [result] = await pool.query(
        `INSERT INTO orders (
          customer_id, restaurant_id, items, total_amount, delivery_fee, 
          tax, status, delivery_address, restaurant_location, 
          special_instructions, payment_method, payment_status, 
          estimated_delivery_time, driver_id, currency, exchange_rate,
          estimated_distance, estimated_duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.customerId,
          order.restaurantId,
          JSON.stringify(order.items),
          totalAmount,
          order.deliveryFee,
          order.tax,
          order.status,
          JSON.stringify(order.deliveryAddress),
          JSON.stringify(order.restaurantLocation),
          order.specialInstructions,
          order.paymentMethod,
          order.paymentStatus,
          order.estimatedDeliveryTime,
          order.driverId,
          order.currency || 'ZMW',
          order.exchangeRate || 1,
          distance,
          duration
        ]
      );

      const orderId = result.insertId;

      // Record status change
      await this.recordStatusChange(orderId, order.status, order.customerId);

      // Notify via WebSocket
      websocketService.sendOrderUpdate(orderId);

      return { orderId, order };
    } catch (error) {
      logger.error('Error creating order:', error);
      throw new AppError('Failed to create order', 500);
    }
  }

  async getOrderById(orderId) {
    try {
      const [orders] = await pool.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );

      if (orders.length === 0) {
        throw new AppError('Order not found', 404);
      }

      const orderData = orders[0];
      return Order.fromJSON({
        ...orderData,
        items: JSON.parse(orderData.items),
        deliveryAddress: JSON.parse(orderData.delivery_address),
        restaurantLocation: JSON.parse(orderData.restaurant_location)
      });
    } catch (error) {
      logger.error('Error getting order:', error);
      throw new AppError('Failed to get order', 500);
    }
  }

  async updateOrderStatus(orderId, status, userId, userRole) {
    try {
      const order = await this.getOrderById(orderId);
      
      if (!this.isValidStatusTransition(order.status, status, userRole)) {
        throw new AppError('Invalid status transition', 400);
      }

      await pool.query(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, orderId]
      );

      if (status === 'in_transit') {
        await pool.query(
          'UPDATE orders SET driver_id = ? WHERE id = ?',
          [userId, orderId]
        );
      }

      // Record status change
      await this.recordStatusChange(orderId, status, userId);

      // Notify via WebSocket
      websocketService.sendOrderUpdate(orderId);

      return this.getOrderById(orderId);
    } catch (error) {
      logger.error('Error updating order status:', error);
      throw new AppError('Failed to update order status', 500);
    }
  }

  async getAvailableOrders(location, radius) {
    try {
      const [orders] = await pool.query(
        `SELECT * FROM orders 
         WHERE status = 'ready_for_pickup' 
         AND ST_Distance_Sphere(
           POINT(?, ?),
           POINT(JSON_EXTRACT(restaurant_location, '$.longitude'), 
                 JSON_EXTRACT(restaurant_location, '$.latitude'))
         ) <= ?`,
        [location.longitude, location.latitude, radius * 1000]
      );

      return orders.map(order => Order.fromJSON({
        ...order,
        items: JSON.parse(order.items),
        deliveryAddress: JSON.parse(order.delivery_address),
        restaurantLocation: JSON.parse(order.restaurant_location)
      }));
    } catch (error) {
      logger.error('Error getting available orders:', error);
      throw new AppError('Failed to get available orders', 500);
    }
  }

  async getDriverOrders(driverId) {
    try {
      const [orders] = await pool.query(
        'SELECT * FROM orders WHERE driver_id = ? ORDER BY created_at DESC',
        [driverId]
      );

      return orders.map(order => Order.fromJSON({
        ...order,
        items: JSON.parse(order.items),
        deliveryAddress: JSON.parse(order.delivery_address),
        restaurantLocation: JSON.parse(order.restaurant_location)
      }));
    } catch (error) {
      logger.error('Error getting driver orders:', error);
      throw new AppError('Failed to get driver orders', 500);
    }
  }

  subscribeToOrderUpdates(orderId, callback) {
    // This is a placeholder for real-time updates
    // In a production environment, you would use WebSockets or a similar technology
    const interval = setInterval(async () => {
      try {
        const order = await this.getOrderById(orderId);
        callback(order);
      } catch (error) {
        logger.error('Error in order update subscription:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }

  isValidStatusTransition(currentStatus, newStatus, userRole) {
    const validTransitions = {
      customer: {
        'pending': ['cancelled'],
        'confirmed': ['cancelled']
      },
      restaurant: {
        'confirmed': ['preparing', 'ready_for_pickup', 'cancelled'],
        'preparing': ['ready_for_pickup', 'cancelled']
      },
      driver: {
        'ready_for_pickup': ['picked_up', 'cancelled'],
        'picked_up': ['in_transit'],
        'in_transit': ['delivered']
      }
    };

    return validTransitions[userRole]?.[currentStatus]?.includes(newStatus) || false;
  }

  async recordStatusChange(orderId, status, userId) {
    try {
      await pool.query(
        `INSERT INTO order_status_history (
          order_id, status, changed_by
        ) VALUES (?, ?, ?)`,
        [orderId, status, userId]
      );
    } catch (error) {
      logger.error('Error recording status change:', error);
    }
  }

  async calculateRoute(start, end) {
    // In a real implementation, this would call a routing service like Google Maps
    // For now, we'll use a simple calculation based on coordinates
    const R = 6371; // Earth's radius in km
    const lat1 = start.latitude * Math.PI / 180;
    const lat2 = end.latitude * Math.PI / 180;
    const dLat = (end.latitude - start.latitude) * Math.PI / 180;
    const dLon = (end.longitude - start.longitude) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km

    // Estimate duration based on distance (assuming average speed of 30 km/h)
    const duration = Math.ceil((distance / 30) * 60); // Duration in minutes

    return { distance, duration };
  }

  async getOrderHistory(orderId) {
    try {
      const [history] = await pool.query(
        `SELECT h.*, u.name as changed_by_name, u.role as changed_by_role
         FROM order_status_history h
         JOIN users u ON h.changed_by = u.id
         WHERE h.order_id = ?
         ORDER BY h.changed_at DESC`,
        [orderId]
      );

      return history;
    } catch (error) {
      logger.error('Error getting order history:', error);
      throw new AppError('Failed to get order history', 500);
    }
  }

  async getOrderTracking(orderId) {
    try {
      const [tracking] = await pool.query(
        `SELECT * FROM order_tracking
         WHERE order_id = ?
         ORDER BY timestamp DESC`,
        [orderId]
      );

      return tracking;
    } catch (error) {
      logger.error('Error getting order tracking:', error);
      throw new AppError('Failed to get order tracking', 500);
    }
  }

  async updateOrderRating(orderId, rating, feedback) {
    try {
      await pool.query(
        `UPDATE orders 
         SET rating = ?, feedback = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [rating, feedback, orderId]
      );

      // Notify via WebSocket
      websocketService.sendOrderUpdate(orderId);

      return this.getOrderById(orderId);
    } catch (error) {
      logger.error('Error updating order rating:', error);
      throw new AppError('Failed to update order rating', 500);
    }
  }

  async convertOrderCurrency(orderId, targetCurrency) {
    try {
      const order = await this.getOrderById(orderId);
      
      if (order.currency === targetCurrency) {
        return order;
      }

      const convertedAmount = await websocketService.convertCurrency(
        order.totalAmount,
        order.currency,
        targetCurrency
      );

      await pool.query(
        `UPDATE orders 
         SET total_amount = ?, currency = ?, exchange_rate = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [convertedAmount, targetCurrency, order.exchangeRate, orderId]
      );

      // Notify via WebSocket
      websocketService.sendOrderUpdate(orderId);

      return this.getOrderById(orderId);
    } catch (error) {
      logger.error('Error converting order currency:', error);
      throw new AppError('Failed to convert order currency', 500);
    }
  }
}

export default OrderService; 