const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: String,
    buyingPrice: { type: Number },
    sellingPrice: { type: Number },
    quantity: { type: Number },
    image: String,
    images: [String]
});

module.exports = mongoose.model('Product', productSchema);
