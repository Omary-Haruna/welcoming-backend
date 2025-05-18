const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// ✅ Add a new sale
router.post('/add', async (req, res) => {
    const {
        soldAt,
        subtotal,
        total,
        items,
        biller,
        customerName,
        customerPhone,
        region,
        district,
        paymentMethod
    } = req.body;

    if (!biller || !customerName || !customerPhone || !region || !district) {
        return res.status(400).json({ success: false, message: 'Missing required customer or biller fields.' });
    }

    if (!items || !items.length || !items.every(item => 'buyingPrice' in item)) {
        return res.status(400).json({ success: false, message: 'Each item must include a buyingPrice.' });
    }

    try {
        const newSale = new Sale({
            soldAt,
            subtotal,
            total,
            items,
            biller,
            customerName,
            customerPhone,
            region,
            district,
            paymentMethod
        });

        await newSale.save();
        res.json({ success: true, sale: newSale });
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
                totalProfit += (item.price - item.buyingPrice) * item.quantity;
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
                totalProfit: totalProfit.toFixed(2)
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 📋 Get unique customers from sales
router.get('/customers', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ soldAt: 1 });
        const customersMap = new Map();

        sales.forEach(sale => {
            const dateOnly = new Date(sale.soldAt).toISOString().split('T')[0];
            if (sale.customerName && sale.customerPhone) {
                const key = `${sale.customerName}-${sale.customerPhone}`;
                const productEntry = sale.items.map(item => ({
                    name: item.name,
                    price: item.price,
                    paymentMethod: sale.paymentMethod || 'Unknown'
                }));

                const existing = customersMap.get(key);

                if (!existing) {
                    customersMap.set(key, {
                        name: sale.customerName,
                        phone: sale.customerPhone,
                        region: sale.region || 'Unknown',
                        products: productEntry,
                        purchaseDates: new Set([dateOnly]),
                        lastDate: sale.soldAt
                    });
                } else {
                    existing.products.push(...productEntry);
                    existing.purchaseDates.add(dateOnly);
                    if (new Date(sale.soldAt) > new Date(existing.lastDate)) {
                        existing.lastDate = sale.soldAt;
                    }
                }
            }
        });

        const customers = Array.from(customersMap.values()).map((c, index) => {
            return {
                id: index.toString(),
                name: c.name,
                phone: c.phone,
                region: c.region,
                products: c.products,
                joinedDate: new Date(c.lastDate).toISOString().split('T')[0],
                returning: c.purchaseDates.size > 1
            };
        });

        res.json({ success: true, customers });
    } catch (err) {
        console.error('❌ /api/sales/customers error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// 📊 Purchase behavior route
router.get('/purchase-behavior', async (req, res) => {
    try {
        const sales = await Sale.find();
        const productCount = {};
        const customerMap = new Map();
        const paymentMethods = {};
        let totalSpend = 0;

        sales.forEach(sale => {
            totalSpend += sale.total;

            sale.items.forEach(item => {
                const productName = item.name?.trim();
                if (!productName) return;

                productCount[productName] = (productCount[productName] || 0) + item.quantity;
            });

            const method = sale.paymentMethod || 'Unknown';
            paymentMethods[method] = (paymentMethods[method] || 0) + 1;

            const customerKey = `${sale.customerName}-${sale.customerPhone}`;
            const date = new Date(sale.soldAt).toISOString().split('T')[0];

            if (!customerMap.has(customerKey)) {
                customerMap.set(customerKey, new Set([date]));
            } else {
                customerMap.get(customerKey).add(date);
            }
        });

        const commonProducts = Object.entries(productCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        let repeatBuyers = 0;
        let oneTimeBuyers = 0;

        for (const dates of customerMap.values()) {
            if (dates.size > 1) repeatBuyers++;
            else oneTimeBuyers++;
        }

        const totalCustomers = customerMap.size;
        const avgSpend = totalCustomers ? Math.floor(totalSpend / totalCustomers) : 0;

        const totalPayments = Object.values(paymentMethods).reduce((a, b) => a + b, 0);
        const paymentMethodPercents = {};
        for (const [method, count] of Object.entries(paymentMethods)) {
            paymentMethodPercents[method] = Math.round((count / totalPayments) * 100);
        }

        res.json({
            success: true,
            data: {
                commonProducts,
                purchaseFrequency: 'Weekly',
                avgSpend,
                repeatBuyers,
                oneTimeBuyers,
                paymentMethods: paymentMethodPercents
            }
        });
    } catch (err) {
        console.error('❌ /purchase-behavior error:', err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
