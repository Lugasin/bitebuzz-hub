import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import dbRoutes from './routes/db.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
  origin: process.env.VITE_CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Implement your login logic here
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Database routes
app.use('/api', dbRoutes);

// Protected routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    // Implement your profile fetching logic here
    res.json({ user: req.user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 