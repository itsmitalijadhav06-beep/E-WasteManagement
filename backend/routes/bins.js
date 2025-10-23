const express = require('express');
const Bin = require('../models/Bin');
const router = express.Router();

// CREATE BIN (NEW!)
router.post('/', async (req, res) => {
  try {
    const bin = new Bin(req.body);
    await bin.save();
    res.status(201).json(bin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET NEARBY BINS
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    const bins = await Bin.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius)
        }
      }
    });
    
    res.json(bins.map(bin => ({
      id: bin._id,
      name: bin.name,
      lat: bin.location.coordinates[1],
      lng: bin.location.coordinates[0],
      fillLevel: bin.fillLevel,
      address: bin.address
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;