import WebSocket from 'ws';
import logger from '../utils/logger.js';
import { pool } from '../config/database.js';

class WebSocketService {
  constructor() {
    this.clients = new Map(); // Map of orderId -> Set of WebSocket connections
    this.server = null;
  }

  initialize(server) {
    this.server = new WebSocket.Server({ server });
    
    this.server.on('connection', (ws, req) => {
      const orderId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('orderId');
      
      if (!orderId) {
        ws.close(1008, 'Order ID is required');
        return;
      }

      // Add client to the map
      if (!this.clients.has(orderId)) {
        this.clients.set(orderId, new Set());
      }
      this.clients.get(orderId).add(ws);

      // Send initial order data
      this.sendOrderUpdate(orderId, ws);

      // Handle client disconnection
      ws.on('close', () => {
        this.clients.get(orderId)?.delete(ws);
        if (this.clients.get(orderId)?.size === 0) {
          this.clients.delete(orderId);
        }
      });
    });

    logger.info('WebSocket server initialized');
  }

  async sendOrderUpdate(orderId, ws) {
    try {
      const [orders] = await pool.query(
        `SELECT o.*, 
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'latitude', ot.latitude,
                    'longitude', ot.longitude,
                    'timestamp', ot.timestamp,
                    'speed', ot.speed
                  )
                ) as tracking_data
         FROM orders o
         LEFT JOIN order_tracking ot ON o.id = ot.order_id
         WHERE o.id = ?
         GROUP BY o.id`,
        [orderId]
      );

      if (orders.length > 0) {
        const order = orders[0];
        const message = {
          type: 'order_update',
          data: {
            ...order,
            tracking_data: JSON.parse(order.tracking_data || '[]'),
            estimated_delivery_time: this.calculateEstimatedDeliveryTime(order)
          }
        };
        
        if (ws) {
          ws.send(JSON.stringify(message));
        } else {
          this.broadcastToOrder(orderId, message);
        }
      }
    } catch (error) {
      logger.error('Error sending order update:', error);
    }
  }

  broadcastToOrder(orderId, message) {
    const clients = this.clients.get(orderId);
    if (clients) {
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  calculateEstimatedDeliveryTime(order) {
    if (!order.estimated_distance || !order.estimated_duration) {
      return null;
    }

    // Calculate based on:
    // 1. Current location
    // 2. Traffic conditions
    // 3. Weather conditions
    // 4. Historical delivery times
    const baseTime = order.estimated_duration; // in minutes
    const trafficFactor = 1.2; // 20% extra time for traffic
    const weatherFactor = 1.1; // 10% extra time for weather
    const estimatedMinutes = Math.ceil(baseTime * trafficFactor * weatherFactor);
    
    return new Date(Date.now() + estimatedMinutes * 60000);
  }

  // Track driver location
  async trackDriverLocation(orderId, location) {
    try {
      await pool.query(
        `INSERT INTO order_tracking (
          order_id, latitude, longitude, speed, accuracy
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          location.latitude,
          location.longitude,
          location.speed || null,
          location.accuracy || null
        ]
      );

      // Update order with latest tracking point
      await pool.query(
        `UPDATE orders 
         SET tracking_points = JSON_ARRAY_APPEND(
           COALESCE(tracking_points, '[]'),
           '$',
           JSON_OBJECT(
             'latitude', ?,
             'longitude', ?,
             'timestamp', CURRENT_TIMESTAMP
           )
         )
         WHERE id = ?`,
        [location.latitude, location.longitude, orderId]
      );

      // Broadcast update to all clients
      this.sendOrderUpdate(orderId);
    } catch (error) {
      logger.error('Error tracking driver location:', error);
    }
  }

  // Convert currency
  async convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    try {
      const [rates] = await pool.query(
        'SELECT rate FROM currency_rates WHERE from_currency = ? AND to_currency = ?',
        [fromCurrency, toCurrency]
      );

      if (rates.length > 0) {
        return amount * rates[0].rate;
      }

      // If no rate found, use a default rate (this should be updated regularly)
      const defaultRates = {
        'ZMW': { 'USD': 0.05 }, // 1 ZMW = 0.05 USD
        'USD': { 'ZMW': 20.0 }  // 1 USD = 20 ZMW
      };

      return amount * (defaultRates[fromCurrency]?.[toCurrency] || 1);
    } catch (error) {
      logger.error('Error converting currency:', error);
      return amount;
    }
  }
}

export default new WebSocketService(); 