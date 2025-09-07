const router = require('express').Router();
const authenticateToken = require('../middleware/auth');
const { signup, login, adminLogin, validateToken } = require('../controllers/authController');

// Keep original endpoints for compatibility
router.post('/api/signup', signup);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/api/validate-token', authenticateToken, validateToken);

module.exports = router;
