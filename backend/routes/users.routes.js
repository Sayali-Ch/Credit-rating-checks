const router = require('express').Router();
const authenticateToken = require('../middleware/auth');
const { getProfile, checkProfile, completeProfile, updateUserBasic } = require('../controllers/userController');

// Profile from user_details
router.get('/api/profile', authenticateToken, getProfile);
router.get('/api/check-profile/:customerId', authenticateToken, checkProfile);
router.post('/api/complete-profile', authenticateToken, completeProfile);

// Optional basic user doc update
router.put('/api/users/basic', authenticateToken, updateUserBasic);

module.exports = router;
