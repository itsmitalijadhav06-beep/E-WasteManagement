// backend/routes/pickups.js
const express = require('express');
const { auth } = require('../middleware/auth'); // DESTRUCTURE
const Pickup = require('../models/Pickup');

const router = express.Router();

// PROTECT ALL ROUTES
router.use(auth);

// CREATE PICKUP REQUEST
router.post('/', async (req, res) => {
  try {
    const { binId, address, preferredTime } = req.body;

    if (!binId || !address) {
      return res.status(400).json({ error: 'binId and address are required' });
    }

    const pickup = new Pickup({
      user: req.user._id,
      bin: binId,
      address,
      preferredTime: preferredTime || new Date(),
      status: 'pending'
    });

    await pickup.save();
    res.status(201).json({ message: 'Pickup requested!', pickup });
  } catch (error) {
    console.error('Create pickup error:', error);
    res.status(500).json({ error: 'Failed to create pickup' });
  }
});

// GET USER'S PICKUPS
router.get('/my', async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id })
      .populate('bin', 'name address')
      .sort({ createdAt: -1 });

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pickups' });
  }
});

module.exports = router;