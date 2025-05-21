// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: String,
    region: String,
    district: String,
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            price: Number,
            quantity: Number,
            image: String,
        }
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
