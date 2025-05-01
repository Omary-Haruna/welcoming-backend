const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product'); // ✅ make sure this path is correct

// ✅ Add a new sale (called during checkout)
router.post('/add', async (req, res) => {
    const { soldAt, subtotal, total, items } = req.body;

    const session = await Product.startSession();
    session.startTransaction();

    try {
        // ✅ Reduce quantity of each product sold
        for (const item of items) {
            const product = await Product.findById(item.id);

            if (!product) {
                throw new Error(`Product with ID ${item.id} not found`);
            }

            // Check for enough stock
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            // Subtract sold quantity
            product.quantity -= item.quantity;
            product.dateModified = new Date();
            await product.save({ session });
        }

        // ✅ Save the sale
        const newSale = new Sale({ soldAt, subtotal, total, items });
        await newSale.save({ session });

        await session.commitTransaction();
        res.json({ success: true });
    } catch (err) {
        await session.abortTransaction();
        console.error('❌ Sale Error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    } finally {
        session.endSession();
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
