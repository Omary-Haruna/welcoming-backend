const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

/* ----------- HELPER FUNCTIONS ----------- */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

/* ---------- REGISTER ---------- */
router.post('/register', async (req, res) => {
    let { name, email, password } = req.body;

    // 🧼 Clean email
    email = email.toLowerCase();

    // 🔒 Input validation
    if (!name || name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({
            error: 'Password must be at least 6 characters and include uppercase, lowercase, and a number.',
        });
    }

    try {
        // 🔍 Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' }); // 🔁 MATCH FRONTEND
        }

        // 🥇 First user becomes admin & active
        const isFirstUser = (await User.countDocuments()) === 0;
        const role = isFirstUser ? 'admin' : 'user';
        const status = isFirstUser ? 'active' : 'pending';

        const user = await User.create({ name, email, password, role, status });

        return res.status(201).json({
            message: 'User registered successfully',
            status: user.status, // ⬅️ frontend uses this to check if "pending"
        });
    } catch (err) {
        console.error('Register error:', err.message);
        return res.status(500).json({ error: 'Server error during registration' });
    }
});


/* ---------- LOGIN ---------- */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.correctPassword(password))) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // 🔒 Only allow active users
        if (user.status === 'pending') {
            return res.status(403).json({ error: 'Your account is pending approval.' });
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
                status: user.status,
                permissions: user.permissions,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Something went wrong during login' });
    }
});

module.exports = router;
