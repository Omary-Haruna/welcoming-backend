// models/PendingCart.js
const mongoose = require('mongoose');

const PendingCartItemSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    total: Number,
});

module.exports = mongoose.model('PendingCart', PendingCartItemSchema);
