const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// ✅ Add a new sale (includes biller and buyingPrice)
router.post('/add', async (req, res) => {
    const { soldAt, subtotal, total, items, biller } = req.body;

    if (!biller) {
        return res.status(400).json({ success: false, message: 'Biller is required.' });
    }

    if (!items.every(item => 'buyingPrice' in item)) {
        return res.status(400).json({ success: false, message: 'Each item must include a buyingPrice.' });
    }

    try {
        const newSale = new Sale({ soldAt, subtotal, total, items, biller });
        await newSale.save();

        res.json({ success: true });
    } catch (err) {
        console.error('❌ Sale Error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ Get all sales
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

// 📊 Summary route
router.get('/summary', async (req, res) => {
    try {
        const sales = await Sale.find();

        if (!sales.length) return res.json({ success: true, summary: null });

        const productCount = {};
        const customerCount = {};
        const dateCount = {};
        let totalProfit = 0;

        sales.forEach(sale => {
            const date = new Date(sale.soldAt).toLocaleDateString();
            dateCount[date] = (dateCount[date] || 0) + 1;

            sale.items.forEach(item => {
                productCount[item.name] = (productCount[item.name] || 0) + item.quantity;

                const profit = (item.price - item.buyingPrice) * item.quantity;
                totalProfit += profit;
            });

            sale.items.forEach(item => {
                if (item.customerName) {
                    customerCount[item.customerName] = (customerCount[item.customerName] || 0) + 1;
                }
            });
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
                totalProfit: totalProfit.toFixed(2)
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 📋 Get unique customers from sales
// 📋 Get unique customers from sales
router.get('/customers', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ soldAt: 1 }); // Oldest to newest

        const customersMap = new Map();

        // 🔁 Loop through all sales
        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (item.customerName && item.customerPhone) {
                    const key = `${item.customerName}-${item.customerPhone}`;
                    const itemTotal = item.price * item.quantity;

                    const existing = customersMap.get(key);

                    // 🆕 First time we see this customer
                    if (!existing) {
                        customersMap.set(key, {
                            name: item.customerName,
                            phone: item.customerPhone,
                            region: item.region || 'Unknown',

                            // ✅ Track most recent sale details
                            lastProduct: item.name,
                            lastPrice: item.price,
                            lastDate: sale.soldAt,

                            count: 1, // purchases count
                        });
                    } else {
                        // ✅ Check if this is a newer sale, and update
                        if (new Date(sale.soldAt) > new Date(existing.lastDate)) {
                            existing.lastProduct = item.name;
                            existing.lastPrice = item.price;
                            existing.lastDate = sale.soldAt;
                        }

                        existing.count += 1;
                    }
                }
            });
        });

        // ✅ Final customer list sent to frontend
        const customers = Array.from(customersMap.values()).map((c, index) => ({
            id: index.toString(),
            name: c.name,
            phone: c.phone,
            region: c.region,
            productBought: c.lastProduct || '—',
            price: c.lastPrice || 0,
            joinedDate: new Date(c.lastDate).toISOString().split('T')[0],
            returning: c.count > 1
        }));

        res.json({ success: true, customers });

    } catch (err) {
        console.error('❌ /api/sales/customers error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});




module.exports = router;
