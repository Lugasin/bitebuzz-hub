import { messaging } from './firebase';
import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';

class NotificationService {
  private notificationPermission: NotificationPermission = 'default';

  constructor() {
    this.requestPermission();
    this.setupMessageHandler();
  }

  private async requestPermission() {
    try {
      this.notificationPermission = await Notification.requestPermission();
      if (this.notificationPermission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: process.env.VITE_FIREBASE_VAPID_KEY
        });
        // Store the token in your database or send it to your server
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  private setupMessageHandler() {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      this.showNotification(payload);
    });
  }

  private showNotification(payload: any) {
    if (this.notificationPermission === 'granted') {
      const { title, body, icon } = payload.notification;
      new Notification(title, {
        body,
        icon: icon || '/logo.png'
      });
    }
  }

  // Create a notification
  async createNotification(userId: string, type: string, title: string, message: string, data?: any) {
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Subscribe to user notifications
  subscribeToNotifications(userId: string, callback: (notifications: any[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    });
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Create order status notification
  async createOrderStatusNotification(orderId: string, status: string, userId: string) {
    const statusMessages: { [key: string]: { title: string; message: string } } = {
      'pending': { title: 'Order Received', message: 'Your order has been received and is being processed' },
      'confirmed': { title: 'Order Confirmed', message: 'Your order has been confirmed by the restaurant' },
      'preparing': { title: 'Order Being Prepared', message: 'The restaurant is preparing your order' },
      'ready': { title: 'Order Ready', message: 'Your order is ready for pickup' },
      'picked': { title: 'Order Picked Up', message: 'Your order has been picked up by the delivery driver' },
      'delivered': { title: 'Order Delivered', message: 'Your order has been delivered' },
      'cancelled': { title: 'Order Cancelled', message: 'Your order has been cancelled' }
    };

    const message = statusMessages[status];
    if (message) {
      await this.createNotification(
        userId,
        'order_update',
        message.title,
        message.message,
        { orderId, status }
      );
    }
  }

  // Create delivery status notification
  async createDeliveryStatusNotification(orderId: string, status: string, userId: string) {
    const statusMessages: { [key: string]: { title: string; message: string } } = {
      'assigned': { title: 'Driver Assigned', message: 'A driver has been assigned to your order' },
      'picked': { title: 'Order Picked Up', message: 'Your order has been picked up by the driver' },
      'delivered': { title: 'Order Delivered', message: 'Your order has been delivered' }
    };

    const message = statusMessages[status];
    if (message) {
      await this.createNotification(
        userId,
        'delivery_update',
        message.title,
        message.message,
        { orderId, status }
      );
    }
  }
}

export const notificationService = new NotificationService(); 