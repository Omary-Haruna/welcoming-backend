const express = require('express');
const router = express.Router();
const PendingCart = require('../models/PendingCart');

// ✅ Get all pending carts (for admin view)
router.get('/all', async (req, res) => {
    try {
        const carts = await PendingCart.find();
        res.json({ success: true, carts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch carts' });
    }
});

// ✅ Get current cart (for SalesCart use)
router.get('/', async (req, res) => {
    try {
        const carts = await PendingCart.find();
        res.json({ success: true, carts }); // 🔁 always use 'carts'
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ✅ Save or update entire pending cart
router.post('/save', async (req, res) => {
    try {
        await PendingCart.deleteMany({});
        await PendingCart.insertMany(req.body.cart);
        res.json({ success: true });
    } catch (error) {
        console.error("Error saving pending cart:", error);
        res.status(500).json({ success: false });
    }
});

// ✅ Clear entire pending cart
router.delete('/clear', async (req, res) => {
    try {
        await PendingCart.deleteMany({});
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ✅ Delete single item from pending cart
router.delete('/item/:id', async (req, res) => {
    try {
        await PendingCart.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
