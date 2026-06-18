// backend/routes/bins.js
const express = require('express');
const Bin = require('../models/Bin');
const { auth, restrictTo } = require('../middleware/auth');
const { sendBinFullNotification } = require('../utils/emailService');
const router = express.Router();

// CREATE BIN (Admin Only)
router.post('/', auth, restrictTo('admin'), async (req, res) => {
  try {
    const { name, address, lat, lng, fillLevel = 0 } = req.body;

    if (!name || !address || lat == null || lng == null) {
      return res.status(400).json({ error: 'name, address, lat, lng are required' });
    }

    const bin = new Bin({
      name,
      address,
      fillLevel: parseInt(fillLevel),
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    });

    await bin.save();
    res.status(201).json({ message: 'Bin created!', bin });
  } catch (error) {
    console.error('Create bin error:', error);
    res.status(500).json({ error: 'Failed to create bin' });
  }
});

// GET NEARBY BINS
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 30000 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const bins = await Bin.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius)
        }
      }
    }).lean();

    const formattedBins = bins.map(bin => ({
      id: bin._id.toString(),
      name: bin.name,
      lat: bin.location.coordinates[1],
      lng: bin.location.coordinates[0],
      fillLevel: bin.fillLevel || 0,
      address: bin.address
    }));

    res.json(formattedBins);
  } catch (error) {
    console.error('Nearby bins error:', error);
    res.status(500).json({ error: 'Failed to fetch bins' });
  }
});

// UPDATE FILL LEVEL
router.post('/update/:binId', auth, async (req, res) => {
  try {
    const { fillLevel } = req.body;
    const level = parseInt(fillLevel);

    if (isNaN(level) || level < 0 || level > 100) {
      return res.status(400).json({ error: 'fillLevel must be 0-100' });
    }

    const bin = await Bin.findByIdAndUpdate(
      req.params.binId,
      { fillLevel: level },
      { new: true }
    );

    if (!bin) {
      return res.status(404).json({ error: 'Bin not found' });
    }

    if (level === 100) {
      try {
        await sendBinFullNotification(bin);
        console.log(`Bin full alert sent for: ${bin.name}`);
      } catch (notifyError) {
        console.error('Notification failed:', notifyError.message);
      }
    }

    res.json({ 
      message: 'Bin fill level updated!', 
      bin: { id: bin._id.toString(), fillLevel: bin.fillLevel }
    });
  } catch (error) {
    console.error('Update bin error:', error);
    res.status(500).json({ error: 'Failed to update bin' });
  }
});

// DELETE ALL BINS (Admin Only)
router.delete('/delete-all', auth, restrictTo('admin'), async (req, res) => {
  try {
    const result = await Bin.deleteMany({});
    res.json({ message: 'All bins deleted!', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Delete all bins error:', error);
    res.status(500).json({ error: 'Failed to delete bins' });
  }
});

// GET SINGLE BIN
router.get('/:binId', auth, async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.binId);
    if (!bin) return res.status(404).json({ error: 'Bin not found' });

    res.json({
      id: bin._id.toString(),
      name: bin.name,
      address: bin.address,
      fillLevel: bin.fillLevel,
      lat: bin.location.coordinates[1],
      lng: bin.location.coordinates[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bin' });
  }
});

// EXPORT ONCE
module.exports = router; // ONLY THIS LINE