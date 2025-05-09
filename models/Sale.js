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
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },         // unit price
            quantity: { type: Number, required: true },
            total: { type: Number, required: true },          // price * quantity
            customerName: { type: String, default: '' },
            customerPhone: { type: String, default: '' },
            paymentMethod: { type: String, default: 'Cash' }  // Cash, Bank, Mobile
        }
    ]
});

module.exports = mongoose.model('Sale', SaleSchema);
