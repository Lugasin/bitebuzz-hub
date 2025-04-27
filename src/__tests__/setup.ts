import { MongoMemoryServer } from 'mongodb-memory-server';
import { dbPool } from '../db';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start MongoDB memory server
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  // Initialize database connection
  await dbPool.connect();
});

afterAll(async () => {
  // Close database connection
  await dbPool.end();
  
  // Stop MongoDB memory server
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await dbPool.query('SHOW TABLES');
  for (const collection of collections) {
    await dbPool.query(`TRUNCATE TABLE ${collection}`);
  }
});

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'test-user-id',
      email: 'test@example.com',
    }),
  }),
  firestore: () => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({
        role: 'customer',
      }),
    }),
  }),
}));

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
})); 