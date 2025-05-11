const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: String,
    buyingPrice: {
        type: Number,
        required: true, // ✅ VERY IMPORTANT for calculating profit
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: String,
    images: [String],
    dateAdded: {
        type: Date,
        default: Date.now,
    },
    dateModified: Date
});

module.exports = mongoose.model('Product', productSchema);
