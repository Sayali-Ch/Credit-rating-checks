const crypto = require('node:crypto');

function generateCustomerId() {
  // CUS_0x + 6 hex chars
  return `CUS_0x${crypto.randomBytes(3).toString('hex')}`;
}

module.exports = { generateCustomerId };
