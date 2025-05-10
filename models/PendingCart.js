const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: String,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    total: {
        type: Number,
        required: true,
    },
    customerName: {
        type: String,
        default: '',
    },
    customerPhone: {
        type: String,
        default: '',
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Mobile Payment', 'Bank'],
        default: 'Cash',
    },
    region: {
        type: String,
        default: '',
    }
}, { _id: false });

const PendingCartSchema = new mongoose.Schema({
    cart: {
        type: [CartItemSchema],
        default: [],
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('PendingCart', PendingCartSchema);
