const mongoose = require('mongoose');

// backend/models/Bin.js
const binSchema = new mongoose.Schema({
  name: String,
  address: String,
  fillLevel: { type: Number, default: 0 },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  }
});

binSchema.index({ location: '2dsphere' }); // MUST HAVE
module.exports = mongoose.model('Bin', binSchema);