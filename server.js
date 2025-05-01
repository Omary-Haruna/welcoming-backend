// Load environment variables from .env
require('dotenv').config();

// Import packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const pendingCartRoutes = require('./routes/pending-cart'); // ✅ ADD THIS LINE

// Use routes
app.use('/api/auth', authRoutes);           // /api/auth/register, /api/auth/login
app.use('/api/products', productRoutes);    // /api/products/all
app.use('/api/sales', salesRoutes);         // /api/sales/add, /api/sales/all
app.use('/api/pending-cart', pendingCartRoutes); // ✅ ADD THIS LINE

// Root route to test API
app.get('/', (req, res) => {
    res.send('✅ API is working!');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('🟢 MongoDB Connected');

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });
