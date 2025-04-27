import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { getFunctions } from 'firebase-admin/functions';
import { getMessaging } from 'firebase-admin/messaging';
import { getRemoteConfig } from 'firebase-admin/remote-config';

// Mock implementations
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
  set: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  startAfter: jest.fn().mockReturnThis(),
  endBefore: jest.fn().mockReturnThis(),
};

const mockAuth = {
  verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user' }),
  createCustomToken: jest.fn().mockResolvedValue('mock-token'),
  getUser: jest.fn().mockResolvedValue({ uid: 'test-user' }),
};

const mockStorage = {
  bucket: jest.fn().mockReturnThis(),
  file: jest.fn().mockReturnThis(),
  upload: jest.fn().mockResolvedValue([{ name: 'test-file' }]),
  download: jest.fn().mockResolvedValue([Buffer.from('test')]),
  delete: jest.fn().mockResolvedValue(undefined),
};

const mockFunctions = {
  httpsCallable: jest.fn().mockReturnThis(),
  https: jest.fn().mockReturnThis(),
  pubsub: jest.fn().mockReturnThis(),
};

const mockMessaging = {
  send: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  sendMulticast: jest.fn().mockResolvedValue({ successCount: 1 }),
};

const mockRemoteConfig = {
  getTemplate: jest.fn().mockResolvedValue({ parameters: {} }),
  publishTemplate: jest.fn().mockResolvedValue(undefined),
};

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn().mockReturnValue({
    firestore: () => mockFirestore,
    auth: () => mockAuth,
    storage: () => mockStorage,
    functions: () => mockFunctions,
    messaging: () => mockMessaging,
    remoteConfig: () => mockRemoteConfig,
  }),
  credential: {
    cert: jest.fn().mockReturnValue({}),
  },
}));

// Test utilities
export function setupTestEnvironment() {
  beforeAll(() => {
    // Initialize Firebase Admin with test config
    initializeApp({
      projectId: 'test-project',
      storageBucket: 'test-bucket',
    });
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Clean up after all tests
    jest.restoreAllMocks();
  });
}

// Helper functions for testing
export async function mockFirestoreData(collection: string, data: any) {
  mockFirestore.get.mockResolvedValueOnce({
    exists: true,
    data: () => data,
  });
}

export async function mockAuthUser(uid: string, customClaims = {}) {
  mockAuth.verifyIdToken.mockResolvedValueOnce({
    uid,
    ...customClaims,
  });
}

export async function mockStorageUpload(filename: string, content: Buffer) {
  mockStorage.upload.mockResolvedValueOnce([{ name: filename }]);
  mockStorage.download.mockResolvedValueOnce([content]);
}

// Example usage:
/*
describe('MyFunction', () => {
  setupTestEnvironment();

  it('should process data correctly', async () => {
    // Setup test data
    await mockFirestoreData('users', { name: 'Test User' });
    await mockAuthUser('test-user-id', { role: 'admin' });

    // Call the function
    const result = await myFunction({ data: {} });

    // Assertions
    expect(result).toBeDefined();
    expect(mockFirestore.set).toHaveBeenCalled();
  });
});
*/ 