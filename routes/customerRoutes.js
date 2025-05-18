const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// @route   POST /api/customers
// @desc    Add a new customer
router.post('/', async (req, res) => {
    const { name, region, district, phone } = req.body;

    if (!name || !region || !district || !phone) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if phone already exists
        const existing = await Customer.findOne({ phone });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Phone already exists' });
        }

        const newCustomer = new Customer({ name, region, district, phone });
        await newCustomer.save();

        res.status(201).json({ success: true, customer: newCustomer });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// Optional: GET all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

module.exports = router;
