const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        default: () => `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${uuidv4().slice(0, 8)}`
    },
    customerName: { type: String, required: true },
    customerPhone: String,
    region: String,
    district: String,

    fromRegion: String,        // ✅ where it's sent from
    toRegion: String,          // ✅ where it's going
    toDistrict: String,        // ✅ delivery district

    expectedArrival: String,   // ✅ e.g. "2025-05-22 14:00"
    parcelGivenTo: String,     // ✅ e.g. driver or handler
    createdBy: String,         // ✅ e.g. "Omary" or "admin@yourshop.com"

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

    orderStatus: {
        type: String,
        enum: ["Pending Pickup", "Picked Up", "Arrived", "Paid"],
        default: "Pending Pickup"
    },

    orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
