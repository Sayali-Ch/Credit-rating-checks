const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/jwt');

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || '';

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = payload; // { customerId, email, name, role }
    next();
  });
};

