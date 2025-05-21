
console.log('✅ admin.js loaded');

// Load environment variables from .env
require('dotenv').config();

// Import packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
    origin: 'https://www.welcomingtechnology.com',
    credentials: true
}));

app.use(express.json());

// Route files
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const pendingCartRoutes = require('./routes/pending-cart'); // ✅ pending cart route
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customerRoutes'); // ✅ Add this
const orderRoutes = require('./routes/orders');





// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/pending-cart', pendingCartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);




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
