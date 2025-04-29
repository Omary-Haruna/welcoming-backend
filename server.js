// Load environment variables from .env
require('dotenv').config();

// Import packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Allow frontend to access backend
app.use(express.json()); // Parse incoming JSON

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // Example: /api/auth/register, /api/auth/login

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);


// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🟢 MongoDB Connected');

        // Ensure to bind to the correct port for Render
        const PORT = process.env.PORT || 4000;

        // Listen on all IP addresses (0.0.0.0) for Render compatibility
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// Optional: Test route to check if API is working
app.get('/', (req, res) => {
    res.send('✅ API is working!');
});
