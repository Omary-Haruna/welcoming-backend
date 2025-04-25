const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load from .env
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

/* ---------- REGISTER ---------- */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // First registered user is admin
        const isFirstUser = (await User.countDocuments()) === 0;
        const role = isFirstUser ? 'admin' : 'user';

        const user = await User.create({ name, email, password, role });

        return res.status(201).json({ message: 'user-created' });
    } catch (err) {
        return res.status(400).json({ error: 'Email already in use' });
    }
});

/* ---------- LOGIN ---------- */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.correctPassword(password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;
