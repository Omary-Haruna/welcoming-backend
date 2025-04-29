const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { JWT_SECRET } = process.env;

/* 
|--------------------------------------------------------------------------
| Middleware: Protect Routes
|--------------------------------------------------------------------------
| Verifies JWT token from Authorization header and attaches user to req.user
*/
exports.protect = async (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Not logged in, token missing' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find user by ID and remove password field
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        req.user = user; // Attach user to request
        next(); // Proceed to next middleware or controller
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ error: 'Token invalid or expired' });
    }
};

/* 
|--------------------------------------------------------------------------
| Middleware: Restrict Access to Admins Only
|--------------------------------------------------------------------------
| Allows only admin users to proceed
*/
exports.restrictToAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admins only' });
    }
    next();
};
