const QRCode = require('qrcode');

const generateQRCode = async (trackingId) => {
  const qrData = `${process.env.FRONTEND_URL}/track/${trackingId}`;
  return await QRCode.toDataURL(qrData);
};

module.exports = { generateQRCode };