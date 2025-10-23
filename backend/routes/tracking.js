const express = require('express');
const auth = require('../middleware/auth');
const { generateQRCode } = require('../utils/qrGenerator');
const Tracking = require('../models/Tracking');

const router = express.Router();

// Submit waste (generate QR)
router.post('/submit', auth, async (req, res) => {
  try {
    const { binId, wasteType, weight } = req.body;
    
    const trackingId = new mongoose.Types.ObjectId();
    const qrCode = await generateQRCode(trackingId);
    
    const tracking = new Tracking({
      _id: trackingId,
      userId: req.user._id,
      binId,
      qrCode,
      wasteType,
      weight
    });

    await tracking.save();
    res.status(201).json({ 
      message: 'Waste submitted', 
      trackingId: tracking._id, 
      qrCode 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tracking status
router.get('/:id/status', auth, async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    }).populate('binId');

    if (!tracking) return res.status(404).json({ error: 'Tracking not found' });

    res.json({
      id: tracking._id,
      status: tracking.status,
      wasteType: tracking.wasteType,
      weight: tracking.weight,
      qrCode: tracking.qrCode,
      bin: tracking.binId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;