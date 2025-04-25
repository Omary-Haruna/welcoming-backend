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

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🟢 MongoDB Connected');
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
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
