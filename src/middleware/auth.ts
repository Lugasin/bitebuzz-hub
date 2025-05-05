
import { Request, Response, NextFunction } from 'express';

// Define the User interface to type the authenticated user data
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  restaurantId?: string;
}

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// The authenticate middleware verifies user authentication and adds user data to the request
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
      return;
    }
    
    // In a real implementation, you would verify the token and extract user data
    // For this simplified version, we'll use mock data
    const token = authHeader.split(' ')[1];
    
    if (token === 'invalid') {
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
      return;
    }
    
    // Mock user data - in production this would come from token verification
    req.user = {
      id: '123456',
      email: 'user@example.com',
      name: 'Test User',
      role: 'CUSTOMER',
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};
