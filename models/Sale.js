const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    soldAt: {
        type: Date,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    biller: {
        type: String,
        required: true  // username of the person who performed the sale
    },
    paymentMethod: {
        type: String,
        default: 'Cash'
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },         // selling price per item
            buyingPrice: { type: Number, required: true },   // cost price per item
            quantity: { type: Number, required: true },
            total: { type: Number, required: true }          // price * quantity
        }
    ]
});

module.exports = mongoose.model('Sale', SaleSchema);
