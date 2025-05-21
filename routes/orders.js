// routes/orders.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/create", async (req, res) => {
    try {
        const { customer, cart } = req.body;

        const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

        const newOrder = new Order({
            customerName: customer.name,
            customerPhone: customer.phone,
            region: customer.region,
            district: customer.district,
            products: cart.map((item) => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),
            totalAmount,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ success: true, order: savedOrder });
    } catch (error) {
        console.error("❌ Failed to save order:", error.message);
        res.status(500).json({ success: false, message: "Failed to save order" });
    }
});

module.exports = router;
