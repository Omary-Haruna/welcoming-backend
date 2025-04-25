const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

/* verify token, attach user */
exports.protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch {
        res.status(401).json({ error: 'Token invalid or expired' });
    }
};

/* only admin */
exports.restrictToAdmin = (req, res, next) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ error: 'Admins only' });
    next();
};
