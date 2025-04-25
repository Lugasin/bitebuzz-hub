// Entry point for the E-eats API using Node.js and Express.js as a Firebase Cloud Function
import * as functions from 'firebase-functions';
import express from 'express';
import User from './src/models/user.js';
import cors from 'cors';
import verifyToken from './src/middlewares/auth.js';


const app = express(); // Initialize express app
 
// Enable CORS
app.use(cors({ origin: true }));


// Global Middlewares
app.use(express.json());
app.use((req, res, next) => {
    console.log('Main middleware called');
    next();
});

// API route to get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "Failed to get users" });
    }
});

// Default 404 route
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error Handling Middleware


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Root Route
app.get('/', (req, res) => {
    console.log('Root route handler called');
    res.json({ status: 'ok', message: 'E-eats API is working' });
});

// Export the app as a Firebase Cloud Function
export const api = functions.https.onRequest(app);
