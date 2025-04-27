import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import admin from 'firebase-admin';
import { dbPool } from './db';

export function setupWebSockets(server: Server) {
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decodedToken = await admin.auth().verifyIdToken(token);
      socket.data.user = decodedToken;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.uid}`);
    
    // Join customer to order tracking room
    socket.on('join-order-tracking', async (orderId) => {
      try {
        // Verify user has access to this order
        const [order] = await dbPool.query(
          'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = ?))',
          [orderId, socket.data.user.uid, socket.data.user.uid]
        );

        if (order) {
          socket.join(`order:${orderId}`);
          console.log(`User ${socket.data.user.uid} joined order tracking for ${orderId}`);
        }
      } catch (error) {
        console.error('Error joining order tracking:', error);
      }
    });
    
    // Handle courier location updates
    socket.on('update-location', async (data) => {
      try {
        const { orderId, latitude, longitude } = data;
        const userId = socket.data.user.uid;
        
        // Check if courier is assigned to this order
        const [delivery] = await dbPool.query(
          'SELECT * FROM deliveries WHERE order_id = ? AND driver_id = ?',
          [orderId, userId]
        );
        
        if (delivery) {
          // Update location in database
          await dbPool.query(
            'UPDATE deliveries SET current_location = POINT(?, ?) WHERE order_id = ?',
            [longitude, latitude, orderId]
          );
          
          // Store in history
          await dbPool.query(
            'INSERT INTO courier_location_history (courier_id, order_id, latitude, longitude) VALUES (?, ?, ?, ?)',
            [userId, orderId, latitude, longitude]
          );
          
          // Broadcast to customers tracking this order
          io.to(`order:${orderId}`).emit('courier-location-updated', {
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });
    
    // Handle order status updates
    socket.on('update-order-status', async (data) => {
      try {
        const { orderId, status } = data;
        const userId = socket.data.user.uid;
        
        // Check permission to update this order
        const [order] = await dbPool.query(
          'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR restaurant_id IN (SELECT id FROM restaurants WHERE owner_id = ?))',
          [orderId, userId, userId]
        );
        
        if (order) {
          // Update status in database
          await dbPool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
          );
          
          // Broadcast to everyone tracking this order
          io.to(`order:${orderId}`).emit('order-status-updated', {
            status,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.uid}`);
    });
  });

  return io;
} 