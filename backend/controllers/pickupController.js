const Pickup = require('../models/Pickup');

exports.schedulePickup = async (userId, address, scheduledTime) => {
  const pickup = new Pickup({
    userId,
    address,
    scheduledTime: new Date(scheduledTime)
  });
  return await pickup.save();
};