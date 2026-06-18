// backend/models/Pickup.js
const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', required: true },
  address: { type: String, required: true },
  preferredTime: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'collected', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', pickupSchema);