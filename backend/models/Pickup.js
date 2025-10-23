const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['requested', 'scheduled', 'in-progress', 'completed', 'cancelled'], 
    default: 'requested' 
  },
  wasteItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tracking' }],
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Pickup', pickupSchema);