const router = require('express').Router();
const User = require('../models/User');
const { protect, restrictToAdmin } = require('../middleware/auth');

// ✅ Admin approves a user by ID
router.put('/approve/:id', protect, restrictToAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { permissions } = req.body;

        user.status = 'active';
        user.permissions = permissions || [];
        await user.save();

        res.json({ message: 'User approved with permissions!' });
    } catch (err) {
        console.error('Approve error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/pending-users', protect, restrictToAdmin, async (req, res) => {
    const users = await User.find({ status: 'pending' }).select('name email _id');
    res.json({ users });
});



module.exports = router;
