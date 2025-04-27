import { Router } from 'express';
import { jwtService } from '../lib/jwtService';
import { setCookieOptions } from '../lib/authMiddleware';
import { securityService } from '../lib/securityService';

const router = Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = securityService.validateInput(req.body, {
      email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, type: 'string', minLength: 8 }
    });

    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    // TODO: Add your user authentication logic here
    // This is where you would verify the user's credentials against your database
    const user = {
      id: 'user-id',
      email,
      role: 'user'
    };

    // Generate access token
    const accessToken = jwtService.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role
    }, '15m'); // Short-lived access token

    // Generate refresh token
    const refreshToken = jwtService.generateToken({
      sub: user.id
    }, '7d'); // Longer-lived refresh token

    // Set HTTP-only cookies
    res.cookie('access_token', accessToken, setCookieOptions());
    res.cookie('refresh_token', refreshToken, {
      ...setCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    securityService.handleError(error as Error, 'login');
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    const validation = securityService.validateInput(req.body, {
      email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, type: 'string', minLength: 8 },
      name: { required: true, type: 'string', minLength: 2 }
    });

    if (!validation.isValid) {
      return res.status(400).json({ error: 'Validation failed', details: validation.errors });
    }

    // TODO: Add your user registration logic here
    // This is where you would create a new user in your database
    const user = {
      id: 'new-user-id',
      email,
      name,
      role: 'user'
    };

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    securityService.handleError(error as Error, 'register');
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }

    const result = jwtService.verifyToken(refreshToken);

    if (!result.isValid) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // TODO: Verify the user still exists and get their current data
    const user = {
      id: result.payload.sub,
      email: 'user@example.com',
      role: 'user'
    };

    // Generate new access token
    const accessToken = jwtService.generateToken({
      sub: user.id,
      email: user.email,
      role: user.role
    }, '15m');

    // Set new access token cookie
    res.cookie('access_token', accessToken, setCookieOptions());

    res.json({
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    securityService.handleError(error as Error, 'refresh');
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user route
router.get('/me', async (req, res) => {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = jwtService.verifyToken(accessToken);

    if (!result.isValid) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // TODO: Get user data from database
    const user = {
      id: result.payload.sub,
      email: result.payload.email,
      role: result.payload.role
    };

    res.json({ user });
  } catch (error) {
    securityService.handleError(error as Error, 'getCurrentUser');
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

export default router; 