
import { MongoMemoryServer } from 'mongodb-memory-server';
import { dbPool } from '../db';

let mongoServer: MongoMemoryServer;

// Set up the database before all tests
beforeAll(async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await dbPool.connect();
});

// Close database connection after all tests
afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  await dbPool.end();
});

// Clear the database before each test
beforeEach(async () => {
  // Clear all collections
  const collections = ['users', 'orders', 'deliveries', 'courier_location_history'];
  for (const collection of collections) {
    await dbPool.query(`DELETE FROM ${collection}`);
  }
});

// Mock the database query method for testing
jest.spyOn(dbPool, 'query').mockImplementation((query, params) => {
  if (query.includes('SELECT * FROM users WHERE id = ?')) {
    return Promise.resolve([
      { 
        id: params?.[0], 
        is_available: true,
        longitude: params && params[0] === 1 ? 28.2833 : 28.2834,
        latitude: params && params[0] === 1 ? -15.4166 : -15.4167,
        status: 'assigned' 
      }
    ]);
  }
  
  if (query.includes('deliveries')) {
    return Promise.resolve([{ status: 'assigned' }]);
  }
  
  // Default response for other queries
  return Promise.resolve([]);
});
