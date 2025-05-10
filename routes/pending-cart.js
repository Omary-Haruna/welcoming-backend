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
            const mergedCart = [...existing.cart];

            cart.forEach(newItem => {
                const index = mergedCart.findIndex(item =>
                    item.id === newItem.id &&
                    item.customerPhone === newItem.customerPhone &&
                    item.paymentMethod === newItem.paymentMethod
                );

                if (index !== -1) {
                    // Merge by increasing quantity & total
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
        res.json({ success: true, message: 'Cart saved successfully' });
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
