const express = require('express');
const router = express.Router();
const PendingCart = require('../models/PendingCart');

router.get('/all', async (req, res) => {
    try {
        const carts = await PendingCart.find();
        res.json({ success: true, carts });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch carts' });
    }
});


// Save or update pending cart
router.post('/save', async (req, res) => {
    try {
        await PendingCart.deleteMany({});
        await PendingCart.insertMany(req.body.cart);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Get pending cart
router.get('/', async (req, res) => {
    try {
        const cart = await PendingCart.find();
        res.json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Clear pending cart
router.delete('/clear', async (req, res) => {
    try {
        await PendingCart.deleteMany({});
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

router.delete('/item/:id', async (req, res) => {
    try {
        await PendingCart.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});


module.exports = router;
