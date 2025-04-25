import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';

class ChatService {
  // Send a message
  async sendMessage(orderId: string, senderId: string, receiverId: string, message: string) {
    try {
      await addDoc(collection(db, 'chat_messages'), {
        orderId,
        senderId,
        receiverId,
        message,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Subscribe to chat messages for an order
  subscribeToChat(orderId: string, callback: (messages: any[]) => void) {
    const q = query(
      collection(db, 'chat_messages'),
      where('orderId', '==', orderId),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  }

  // Get chat participants
  async getChatParticipants(orderId: string) {
    try {
      // In a real implementation, you would fetch this from your database
      // For now, we'll return a mock response
      return {
        customer: { id: 'customer1', name: 'Customer' },
        vendor: { id: 'vendor1', name: 'Restaurant' },
        driver: { id: 'driver1', name: 'Driver' }
      };
    } catch (error) {
      console.error('Error getting chat participants:', error);
      throw error;
    }
  }

  // Format message for display
  formatMessage(message: any, currentUserId: string) {
    return {
      ...message,
      isFromCurrentUser: message.senderId === currentUserId,
      formattedTime: new Date(message.timestamp).toLocaleTimeString()
    };
  }
}

export const chatService = new ChatService(); 