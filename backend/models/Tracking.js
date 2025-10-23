const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
  qrCode: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['submitted', 'collected', 'in-transit', 'recycled', 'disposed'], 
    default: 'submitted' 
  },
  wasteType: { type: String, required: true },
  weight: { type: Number },
  locationHistory: [{
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tracking', trackingSchema);