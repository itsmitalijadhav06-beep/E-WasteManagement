const express = require('express');
const auth = require('../middleware/auth');
const Bin = require('../models/Bin');
const Pickup = require('../models/Pickup');

const router = express.Router();

// Get analytics (admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    const totalBins = await Bin.countDocuments();
    const fullBins = await Bin.countDocuments({ status: 'full' });
    const totalPickups = await Pickup.countDocuments();
    
    res.json({
      totalBins,
      fullBins,
      totalPickups,
      binsFullPercentage: ((fullBins / totalBins) * 100).toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;