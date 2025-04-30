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
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');

app.use('/api/auth', authRoutes);       // /api/auth/register, /api/auth/login
app.use('/api/products', productRoutes); // /api/products/all
app.use('/api/sales', salesRoutes);      // /api/sales/add, /api/sales/all

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🟢 MongoDB Connected');

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// Optional: Test route
app.get('/', (req, res) => {
    res.send('✅ API is working!');
});
