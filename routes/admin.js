const router = require('express').Router();
const User = require('../models/User');
const { protect, restrictToAdmin } = require('../middleware/auth');

// ✅ Approve user by ID and assign permissions
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

// ❌ Disapprove (delete) user by ID
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

// 📄 Get all users with status = 'pending'
router.get('/pending-users', protect, restrictToAdmin, async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' }).select('name email _id status');
        res.json({ users });
    } catch (err) {
        console.error('Pending users error:', err);
        res.status(500).json({ error: 'Server error loading users' });
    }
});

// 🛠️ Edit permissions for an approved user
router.put('/edit-permissions/:id', protect, restrictToAdmin, async (req, res) => {
    try {
        const { permissions } = req.body;

        const user = await User.findById(req.params.id);
        if (!user || user.status !== 'active') {
            return res.status(404).json({ error: 'Approved user not found' });
        }

        user.permissions = permissions || [];
        await user.save();

        res.json({ message: 'Permissions updated successfully' });
    } catch (err) {
        console.error('Edit permissions error:', err);
        res.status(500).json({ error: 'Server error updating permissions' });
    }
});

module.exports = router;
