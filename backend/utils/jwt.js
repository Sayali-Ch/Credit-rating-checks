const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me';

function generateToken({ customerId, email, name, role }) {
  return jwt.sign({ customerId, email, name, role }, JWT_SECRET, { expiresIn: '24h' });
}

module.exports = { generateToken, JWT_SECRET };
