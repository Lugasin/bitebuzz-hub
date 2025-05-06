
/**
 * Database connection pool for the application
 */
interface QueryResult<T = any> {
  rows: T[];
  fields?: any;
}

interface DbPool {
  connect: () => Promise<void>;
  end: () => Promise<void>;
  query: <T = any>(text: string, params?: any[]) => Promise<T[]>;
}

// Mock database pool for development and testing
export const dbPool: DbPool = {
  connect: async () => {
    console.log("Connected to database");
    return Promise.resolve();
  },
  
  end: async () => {
    console.log("Disconnected from database");
    return Promise.resolve();
  },
  
  query: async <T = any>(text: string, params?: any[]): Promise<T[]> => {
    console.log("Executing query:", text, params);
    
    // Mock implementation - in a real app, this would connect to a real database
    if (text.includes("SELECT * FROM users")) {
      return [
        {
          id: params?.[0] || 1,
          email: "user@example.com",
          name: "Test User",
          role: "customer",
          is_available: true,
          longitude: params && params[0] === 1 ? 28.2833 : 28.2834,
          latitude: params && params[0] === 1 ? -15.4166 : -15.4167,
          status: "active"
        }
      ] as unknown as T[];
    }
    
    // Default empty response
    return [] as T[];
  }
};
