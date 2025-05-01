const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// ✅ Add a new sale (no quantity reduction here anymore)
router.post('/add', async (req, res) => {
    const { soldAt, subtotal, total, items } = req.body;

    try {
        const newSale = new Sale({ soldAt, subtotal, total, items });
        await newSale.save();

        res.json({ success: true });
    } catch (err) {
        console.error('❌ Sale Error:', err.message);
        res.status(500).json({ success: false, message: err.message });
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

// ❌ Delete a sale
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
