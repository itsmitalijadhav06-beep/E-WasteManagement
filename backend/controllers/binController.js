const Bin = require('../models/Bin');

exports.findNearbyBins = async (lat, lng, radius) => {
  const bins = await Bin.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radius
      }
    }
  }).select('name location fillLevel status address');

  return bins.map(bin => ({
    id: bin._id,
    name: bin.name,
    lat: bin.location.coordinates[1],
    lng: bin.location.coordinates[0],
    fillLevel: bin.fillLevel,
    status: bin.status,
    address: bin.address
  }));
};