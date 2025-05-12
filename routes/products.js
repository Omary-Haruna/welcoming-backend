const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 🔍 Get all products
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ➕ Add new product
router.post('/add', async (req, res) => {
    try {
        const { name, category, buyingPrice, sellingPrice, quantity, image, images } = req.body;
        const newProduct = new Product({
            name,
            category,
            buyingPrice,
            sellingPrice,
            quantity,
            image,
            images,
        });

        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ✏️ Update product
router.put('/update/:id', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, product: updated });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ❌ Delete product
router.delete('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ✅ Safe: Reduce product quantity after sale (prevents duplicate reduction)
router.post('/reduce-quantity', async (req, res) => {
    const { items } = req.body;

    try {
        // 🛡️ Merge duplicate product IDs
        const mergedItems = {};

        for (const item of items) {
            if (!mergedItems[item.productId]) {
                mergedItems[item.productId] = 0;
            }
            mergedItems[item.productId] += item.quantitySold;
        }

        // 🔁 Reduce quantity safely once per product
        for (const [productId, totalQty] of Object.entries(mergedItems)) {
            const product = await Product.findById(productId);
            if (!product) {
                console.warn(`Product not found: ${productId}`);
                continue;
            }

            console.log(`🛒 Reducing ${totalQty} from ${product.name} (${productId})`);
            product.quantity = Math.max(product.quantity - totalQty, 0);
            product.dateModified = new Date();
            await product.save();
        }

        res.status(200).json({ success: true, message: 'Product quantities updated safely' });
    } catch (error) {
        console.error('Error reducing quantities:', error);
        res.status(500).json({ success: false, message: 'Server error reducing quantities' });
    }
});

// 🔍 Get quantity of a product by ID
router.get('/quantity/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('name quantity');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            productId: product._id,
            name: product.name,
            quantity: product.quantity
        });
    } catch (error) {
        console.error('Error fetching quantity:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


module.exports = router;
