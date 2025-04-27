import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { promisify } from 'util';

class RedisAdapter {
  private static instance: RedisAdapter;
  private pubClient: ReturnType<typeof createClient>;
  private subClient: ReturnType<typeof createClient>;
  private isConnected: boolean = false;

  private constructor() {
    this.pubClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD,
    });

    this.subClient = this.pubClient.duplicate();

    this.setupErrorHandling();
  }

  static getInstance(): RedisAdapter {
    if (!RedisAdapter.instance) {
      RedisAdapter.instance = new RedisAdapter();
    }
    return RedisAdapter.instance;
  }

  private setupErrorHandling() {
    const handleError = (error: Error) => {
      console.error('Redis error:', error);
      this.isConnected = false;
    };

    this.pubClient.on('error', handleError);
    this.subClient.on('error', handleError);

    this.pubClient.on('connect', () => {
      console.log('Redis pub client connected');
      this.isConnected = true;
    });

    this.subClient.on('connect', () => {
      console.log('Redis sub client connected');
      this.isConnected = true;
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await Promise.all([
        this.pubClient.connect(),
        this.subClient.connect(),
      ]);
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await Promise.all([
        this.pubClient.quit(),
        this.subClient.quit(),
      ]);
      this.isConnected = false;
    } catch (error) {
      console.error('Failed to disconnect from Redis:', error);
      throw error;
    }
  }

  async setupSocketIO(io: Server): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      io.adapter(createAdapter(this.pubClient, this.subClient));
      console.log('Socket.IO Redis adapter initialized');
    } catch (error) {
      console.error('Failed to setup Socket.IO Redis adapter:', error);
      throw error;
    }
  }

  // Redis utility methods
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const setAsync = promisify(this.pubClient.set).bind(this.pubClient);
    await setAsync(key, JSON.stringify(value));
    
    if (ttl) {
      const expireAsync = promisify(this.pubClient.expire).bind(this.pubClient);
      await expireAsync(key, ttl);
    }
  }

  async get(key: string): Promise<any> {
    const getAsync = promisify(this.pubClient.get).bind(this.pubClient);
    const value = await getAsync(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    const delAsync = promisify(this.pubClient.del).bind(this.pubClient);
    await delAsync(key);
  }

  async publish(channel: string, message: any): Promise<void> {
    const publishAsync = promisify(this.pubClient.publish).bind(this.pubClient);
    await publishAsync(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    this.subClient.subscribe(channel, (message) => {
      callback(JSON.parse(message));
    });
  }
}

// Example usage:
/*
import { Server } from 'socket.io';
import { RedisAdapter } from './utils/redisAdapter';

const io = new Server();
const redisAdapter = RedisAdapter.getInstance();

// Setup Redis adapter for Socket.IO
await redisAdapter.setupSocketIO(io);

// Use Redis for caching
await redisAdapter.set('user:123', { name: 'John' }, 3600);
const user = await redisAdapter.get('user:123');

// Use Redis for pub/sub
await redisAdapter.publish('notifications', { type: 'new_order', orderId: '123' });
await redisAdapter.subscribe('notifications', (message) => {
  console.log('Received notification:', message);
});
*/ 