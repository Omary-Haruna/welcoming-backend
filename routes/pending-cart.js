const express = require('express');
const router = express.Router();
const PendingCart = require('../models/PendingCart');

// ✅ Save cart (merge with existing)
router.post('/save', async (req, res) => {
    const { cart } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty or invalid.' });
    }

    try {
        let existing = await PendingCart.findOne();

        if (!existing) {
            existing = new PendingCart({ cart });
        } else {
            // Merge new cart items with existing ones (by id)
            const mergedCart = [...existing.cart];

            cart.forEach(newItem => {
                const index = mergedCart.findIndex(item => item.id === newItem.id);
                if (index !== -1) {
                    // If exists, update quantity and total
                    mergedCart[index].quantity += newItem.quantity;
                    mergedCart[index].total += newItem.total;
                } else {
                    mergedCart.push(newItem);
                }
            });

            existing.cart = mergedCart;
            existing.updatedAt = new Date();
        }

        await existing.save();
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Error saving pending cart:', err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ✅ Load existing pending cart
router.get('/', async (req, res) => {
    try {
        const data = await PendingCart.findOne();
        res.json({ success: true, cart: data?.cart || [] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load pending cart' });
    }
});

// ✅ Clear cart
router.delete('/clear', async (req, res) => {
    try {
        await PendingCart.deleteMany();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to clear pending cart' });
    }
});

module.exports = router;
