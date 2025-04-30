const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale'); // ✅ make sure this path is correct

// ✅ Add a new sale (called during checkout)
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

// ✅ Get all sales (for SalesSummary)
router.get('/all', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ soldAt: -1 });
        res.json({ success: true, sales });
    } catch (err) {
        console.error('❌ Error in /api/sales/all:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch sales' });
    }
});

// DELETE /api/sales/:id
// routes/sales.js
router.delete('/:id', async (req, res) => {
    try {
        const result = await Sale.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Delete failed' });
    }
});



module.exports = router;
