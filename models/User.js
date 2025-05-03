const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['pending', 'active'],
        default: 'pending', // 👈 All users start as pending
    },
    permissions: {
        type: [String],
        default: [],
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Check if password is correct
userSchema.methods.correctPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

module.exports = model('User', userSchema);
