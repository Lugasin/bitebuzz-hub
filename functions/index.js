// This is the entry point of the E-eats API using Node.js and Express.js
const express = require('express');
const pool = require('./src/config/database');
const { admin } = require('./src/config/firebase');
const verifyToken = require('./src/middlewares/auth');
const userRoutes = require('./src/modules/users/userRoutes');
const restaurantRoutes = require('./src/modules/restaurants/restaurantRoutes');
const orderRoutes = require('./src/modules/orders/orderRoutes');
const authRoutes = require('./src/modules/auth/authRoutes');

const app = express();
const port = 3000;

// Global Middlewares
app.use(express.json());
app.use((req, res, next) => {
    console.log('Main middleware called');
    next();
});


// Auth Routes (No Auth Middleware)
app.use('/auth', authRoutes);

// Protected Routes (Require Auth Middleware)
app.use(verifyToken); // Apply to all routes below this line

app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
    console.log('Root route handler called');
    res.json({ status: 'ok', message: 'E-eats API is working' });
});

// Start the server
app.listen(port, () => {
    console.log(`E-eats API listening at http://localhost:${port}`);
});