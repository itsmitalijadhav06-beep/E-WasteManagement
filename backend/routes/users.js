// backend/routes/users.js
const express = require('express');
const { auth } = require('../middleware/auth'); // DESTRUCTURE
const User = require('../models/User');

const router = express.Router();

// PROTECT ALL ROUTES
router.use(auth); // Now `auth` is a FUNCTION

// GET CURRENT USER
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('GET /me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;