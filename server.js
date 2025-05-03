// Load environment variables from .env
require('dotenv').config();

// Import packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const pendingCartRoutes = require('./routes/pending-cart'); // ✅ pending cart route
const adminRoutes = require('./routes/admin'); // ✅ NEW



// Register routes
app.use('/api/auth', authRoutes);               // /api/auth/register, /api/auth/login
app.use('/api/products', productRoutes);        // /api/products/all
app.use('/api/sales', salesRoutes);             // /api/sales/add, /api/sales/all
app.use('/api/pending-cart', pendingCartRoutes); // ✅ pending-cart/save, /all, /clear
app.use('/api/admin', adminRoutes);


// Root test route
app.get('/', (req, res) => {
    res.send('✅ API is working!');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)

    .then((connection) => {
        const dbName = connection.connections[0].name;  // 👈 This line checks the database name
        console.log('🟢 MongoDB Connected');
        console.log('🧠 Your system is using this database:', dbName);  // 👈 This line prints the database name


        const PORT = process.env.PORT || 4000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });
