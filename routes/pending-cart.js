const express = require('express');
const router = express.Router();
const PendingCart = require('../models/PendingCart');

// ✅ Save cart (append with unique cartId entries)
router.post('/save', async (req, res) => {
    const { cart, _id } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty or invalid.' });
    }

    for (const [index, item] of cart.entries()) {
        if (!item.cartId) {
            return res.status(400).json({ success: false, message: `Missing cartId in item ${index}` });
        }
        if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
            return res.status(400).json({ success: false, message: `Invalid data in item ${index}` });
        }
    }

    try {
        let existing = null;

        // ✅ Try finding by _id if provided
        if (_id) {
            existing = await PendingCart.findById(_id);
        }

        // ✅ Fall back to the first pending cart if no ID found
        if (!existing) {
            existing = new PendingCart({ cart });
        } else {
            existing.cart = cart;
            existing.updatedAt = new Date();
        }

        await existing.save();
        res.json({ success: true, message: 'Cart saved successfully', _id: existing._id });
    } catch (err) {
        console.error('❌ Error saving pending cart:', err.message);
        res.status(500).json({ success: false, message: 'Failed to save cart' });
    }
});



// ✅ Load existing pending cart
router.get('/', async (req, res) => {
    try {
        const data = await PendingCart.findOne();
        res.json({ success: true, cart: data?.cart || [] });
    } catch (err) {
        console.error('❌ Error loading cart:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load pending cart' });
    }
});

// ✅ Clear all pending carts
router.delete('/clear', async (req, res) => {
    try {
        await PendingCart.deleteMany();
        res.json({ success: true, message: 'Pending cart cleared successfully' });
    } catch (err) {
        console.error('❌ Error clearing cart:', err.message);
        res.status(500).json({ success: false, message: 'Failed to clear pending cart' });
    }
});

module.exports = router;
