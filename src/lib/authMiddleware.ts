import { Request, Response, NextFunction } from 'express';
import { jwtService } from './jwtService';
import { securityService } from './securityService';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

// Rate limiting for auth endpoints
const authLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later'
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from HTTP-only cookie
    const token = req.cookies.access_token;
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No access token found'
      });
    }

    // Verify token
    const result = jwtService.verifyToken(token);
    
    if (!result.isValid) {
      // If token is expired, try to refresh it
      if (result.error === 'Token expired') {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken) {
          const refreshResult = jwtService.verifyToken(refreshToken);
          if (refreshResult.isValid) {
            // Generate new access token
            const newAccessToken = jwtService.generateToken({
              sub: refreshResult.payload.sub,
              email: refreshResult.payload.email,
              role: refreshResult.payload.role
            }, '15m');

            // Set new access token cookie
            res.cookie('access_token', newAccessToken, setCookieOptions());
            
            // Add user info to request
            req.user = refreshResult.payload;
            req.token = newAccessToken;
            return next();
          }
        }
      }

      return res.status(401).json({ 
        error: 'Invalid token',
        message: result.error
      });
    }

    // Handle token rotation
    if (result.error === 'Token needs rotation') {
      const newAccessToken = jwtService.generateToken({
        sub: result.payload.sub,
        email: result.payload.email,
        role: result.payload.role
      }, '15m');

      // Revoke old token
      if (result.payload.jti) {
        jwtService.revokeToken(result.payload.jti);
      }

      // Set new access token cookie
      res.cookie('access_token', newAccessToken, setCookieOptions());
      req.token = newAccessToken;
    }

    // Add user info to request
    req.user = result.payload;
    next();
  } catch (error) {
    securityService.handleError(error as Error, 'authentication');
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid token format'
    });
  }
};

// Middleware to check if user has required role
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to set secure cookie options
export const setCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000, // 15 minutes for access token
    path: '/'
  };
};

// Middleware to set refresh token cookie options
export const setRefreshCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    path: '/'
  };
};

// Middleware to check rate limits
export const checkRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const result = securityService.checkRateLimit(req.ip);
  if (!result.allowed) {
    return res.status(429).json({
      error: 'Too many requests',
      message: authLimiter.message,
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
    });
  }
  next();
}; 