const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            default: '',
        },
        region: {
            type: String,
            default: '',
        },
        district: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Customer', customerSchema);
