
// Chat service for handling in-app messaging

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface ChatParticipants {
  customer: ChatParticipant;
  vendor: ChatParticipant;
  driver?: ChatParticipant;
}

class ChatService {
  async getChatParticipants(orderId: string): Promise<ChatParticipants> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      // Return mock participants
      return {
        customer: {
          id: 'customer1',
          name: 'John Doe',
          role: 'CUSTOMER'
        },
        vendor: {
          id: 'vendor1',
          name: 'Pizza Palace',
          role: 'VENDOR'
        },
        driver: {
          id: 'driver1',
          name: 'Mike Driver',
          role: 'DRIVER'
        }
      };
    } catch (error) {
      console.error('Error getting chat participants:', error);
      throw error;
    }
  }
  
  async sendMessage(orderId: string, senderId: string, receiverId: string, message: string): Promise<void> {
    try {
      console.log(`Sending message for order ${orderId}:`, { senderId, receiverId, message });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  subscribeToChat(orderId: string, callback: (messages: ChatMessage[]) => void) {
    console.log(`Subscribing to chat for order ${orderId}`);
    
    // In a real app, this would set up a real-time listener
    // For demonstration, generate a mock message after 2 seconds
    setTimeout(() => {
      callback([{
        id: '1',
        senderId: 'vendor1',
        receiverId: 'customer1',
        message: 'Your order is being prepared!',
        timestamp: new Date()
      }]);
    }, 2000);
    
    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from chat for order ${orderId}`);
    };
  }
  
  formatMessage(message: ChatMessage, currentUserId: string) {
    return {
      ...message,
      isFromCurrentUser: message.senderId === currentUserId,
      formattedTime: message.timestamp.toLocaleTimeString()
    };
  }
}

export const chatService = new ChatService();
