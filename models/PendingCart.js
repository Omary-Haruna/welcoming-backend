const mongoose = require('mongoose');

const PendingCartSchema = new mongoose.Schema({
    id: String,
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    total: Number
});

module.exports = mongoose.model('PendingCart', PendingCartSchema);
