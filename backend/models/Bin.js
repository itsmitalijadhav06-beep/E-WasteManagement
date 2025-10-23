const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { 
      type: [Number],  // [lng, lat] array
      required: true,
      index: '2dsphere'
    }
  },
  fillLevel: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);