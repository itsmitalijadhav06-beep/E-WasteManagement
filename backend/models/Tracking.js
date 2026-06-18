// backend/routes/tracking.js
const express = require('express');
const { auth } = require('../middleware/auth'); // DESTRUCTURE!
const Pickup = require('../models/Pickup');

const router = express.Router();

// PROTECT ALL ROUTES
router.use(auth);

// GET TRACKING INFO
router.get('/:pickupId', async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.pickupId)
      .populate('user', 'username phone')
      .populate('bin', 'name address location');

    if (!pickup) {
      return res.status(404).json({ error: 'Pickup not found' });
    }

    // Only allow user to track their own pickup
    if (pickup.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: pickup._id,
      status: pickup.status,
      address: pickup.address,
      preferredTime: pickup.preferredTime,
      bin: pickup.bin,
      createdAt: pickup.createdAt
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;