const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale'); // Make sure the model exists

// Add sale to database
router.post('/add', async (req, res) => {
    try {
        const newSale = new Sale(req.body);
        await newSale.save();
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Error in /api/sales/add:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
