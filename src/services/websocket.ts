
// Mock WebSocket client for the application

interface WebSocketMessage {
  body: string;
}

interface WebSocketSubscription {
  unsubscribe: () => void;
}

interface WebSocketClient {
  subscribe: (topic: string, callback: (message: WebSocketMessage) => void) => WebSocketSubscription;
  publish: (options: { destination: string; body: string }) => void;
}

// Create a mock WebSocket client
export const wsClient: WebSocketClient = {
  subscribe: (topic, callback) => {
    console.log(`Subscribed to ${topic}`);
    // Return an unsubscribe function
    return {
      unsubscribe: () => {
        console.log(`Unsubscribed from ${topic}`);
      }
    };
  },
  publish: (options) => {
    console.log(`Published message to ${options.destination}`, options.body);
  }
};
