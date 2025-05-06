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
router.get('/pending-users', async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' }).select('name email _id');
        res.json({ users });
    } catch (err) {
        console.error('Pending users error:', err);
        res.status(500).json({ error: 'Server error loading users' });
    }
});
// ❌ Disapprove (Delete) user
router.delete('/disapprove/:id', protect, restrictToAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User disapproved and removed.' });
    } catch (err) {
        console.error('Disapprove error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});





module.exports = router;
