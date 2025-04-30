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
    items: [
        {
            name: String,
            quantity: Number,
            total: Number
        }
    ]
});

module.exports = mongoose.model('Sale', SaleSchema);
