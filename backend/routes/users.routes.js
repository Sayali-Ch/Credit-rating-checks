const router = require('express').Router();
const authenticateToken = require('../middleware/auth');
const { signup, login, adminLogin, validateToken, regenerateToken } = require('../controllers/authController');
const { 
  getProfile, 
  checkProfile, 
  completeProfile, 
  updateProfile,
  getCreditScore,
  saveCreditScoreData,
  updateUserBasic,
  getCreditScoreDistribution,
  getLoanApplications,
  getUserByCustomerId
} = require('../controllers/userController');

// Auth routes
router.post('/api/signup', signup);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/api/validate-token', authenticateToken, validateToken);
router.post('/api/regenerate-token', authenticateToken, regenerateToken);

// User profile routes
router.get('/api/profile', authenticateToken, getProfile);
router.get('/api/check-profile/:customerId', checkProfile);
router.post('/api/complete-profile', authenticateToken, completeProfile);
router.put('/api/profile', authenticateToken, updateProfile);

// Credit score routes
router.get('/api/credit-score/:customerId', getCreditScore);
router.post('/api/credit-score', authenticateToken, saveCreditScoreData);
router.put('/api/user-basic/:customerId', updateUserBasic);

// Analytics routes
router.get('/api/analytics/credit-score-distribution', authenticateToken, getCreditScoreDistribution);

// Loan application routes
router.get('/api/applications', authenticateToken, getLoanApplications);

// Test route without authentication
router.get('/api/test-applications', getLoanApplications);

// Get user by customer ID (temporarily without auth for testing)
router.get('/api/users/:customerId', getUserByCustomerId);

module.exports = router;
