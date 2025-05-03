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

router.get('/summary', async (req, res) => {
    try {
        const sales = await Sale.find();

        if (!sales.length) return res.json({ success: true, summary: null });

        const productCount = {};
        const customerCount = {};
        const dateCount = {};

        sales.forEach(sale => {
            const date = new Date(sale.soldAt).toLocaleDateString();
            dateCount[date] = (dateCount[date] || 0) + 1;

            sale.items.forEach(item => {
                productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
            });

            if (sale.customerName) {
                customerCount[sale.customerName] = (customerCount[sale.customerName] || 0) + 1;
            }
        });

        const topProduct = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];
        const topDate = Object.entries(dateCount).sort((a, b) => b[1] - a[1])[0];
        const topCustomer = Object.entries(customerCount).sort((a, b) => b[1] - a[1])[0];

        res.json({
            success: true,
            summary: {
                topProduct: topProduct?.[0] || 'N/A',
                mostSoldItem: topProduct?.[0] || 'N/A',
                topSellingDate: topDate?.[0] || 'N/A',
                topCustomer: topCustomer?.[0] || 'N/A',
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


module.exports = router;
