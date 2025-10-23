const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['bin_full', 'pickup_scheduled', 'pickup_completed', 'status_update'] },
  title: String,
  message: String,
  binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
  pickupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pickup' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);