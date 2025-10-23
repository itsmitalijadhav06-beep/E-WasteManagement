const express = require('express');
const auth = require('../middleware/auth');
const Pickup = require('../models/Pickup');

const router = express.Router();

// Schedule pickup
router.post('/schedule', auth, async (req, res) => {
  try {
    const { address, scheduledTime } = req.body;
    const pickup = new Pickup({
      userId: req.user._id,
      address,
      scheduledTime: new Date(scheduledTime)
    });

    await pickup.save();
    res.status(201).json({ 
      message: 'Pickup scheduled', 
      pickup: { id: pickup._id, address, scheduledTime: pickup.scheduledTime } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my pickups
router.get('/my', auth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ userId: req.user._id })
      .populate('collectorId', 'username')
      .sort({ scheduledTime: -1 });

    res.json(pickups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;