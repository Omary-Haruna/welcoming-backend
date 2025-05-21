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
    expectedArrival: String, // 🆕 e.g., "2025-05-22 14:00"
    parcelGivenTo: String,   // 🆕 person who picked up the parcel

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

    orderDate: { type: Date, default: Date.now } // 💾 time order was created
});

module.exports = mongoose.model("Order", OrderSchema);
