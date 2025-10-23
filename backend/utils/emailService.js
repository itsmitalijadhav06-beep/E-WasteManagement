console.log('📧 Email service loaded - NO ERRORS');

const sendWelcomeEmail = (email, username) => {
  console.log(`📧 Welcome: ${username} (${email})`);
};

const sendBinFullNotification = (bin) => {
  console.log(`🔔 Bin FULL: ${bin.name}`);
};

module.exports = { sendWelcomeEmail, sendBinFullNotification };