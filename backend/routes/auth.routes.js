const router = require('express').Router();
const authenticateToken = require('../middleware/auth');
const { signup, login, adminLogin, validateToken, regenerateToken } = require('../controllers/authController');

// Existing routes
router.post('/api/signup', signup);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/api/validate-token', authenticateToken, validateToken);

// New regenerate token route
router.post('/api/regenerate-token', authenticateToken, regenerateToken);

module.exports = router;
3