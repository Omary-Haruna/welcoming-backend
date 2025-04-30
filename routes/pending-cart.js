const express = require('express');
const router = express.Router();
const PendingCart = require('../models/PendingCart');

// Save cart items
router.post('/save', async (req, res) => {
    try {
        await PendingCart.deleteMany(); // clear previous
        await PendingCart.insertMany(req.body.cart); // save new
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Get all pending carts
router.get('/all', async (req, res) => {
    try {
        const carts = await PendingCart.find();
        res.json({ success: true, carts });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Delete single item
router.delete('/item/:id', async (req, res) => {
    try {
        await PendingCart.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Clear all
router.delete('/clear', async (req, res) => {
    try {
        await PendingCart.deleteMany();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
