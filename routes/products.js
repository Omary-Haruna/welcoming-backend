const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Add new product
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

// ✅ Update product
router.put('/update/:id', async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, product: updated });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// ✅ Delete product
router.delete('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
