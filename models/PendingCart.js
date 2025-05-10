const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    id: String,
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    total: Number,
    customerName: String,
    customerPhone: String,
    paymentMethod: String
});

const PendingCartSchema = new mongoose.Schema({
    cart: [CartItemSchema],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingCart', PendingCartSchema);
