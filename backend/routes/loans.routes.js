const router = require('express').Router();
const authenticateToken = require('../middleware/auth');
const {
  createLoan,
  getLoansByCustomer,
  getMyLoans,
  getAllLoans
} = require('../controllers/loanController');

const { submitLoanApplication } = require('../controllers/userController');

// New loan application endpoint (detailed)
router.post('/api/loans/apply', submitLoanApplication);

// Backward-compatible endpoints mapped to loans
router.post('/api/customer-applications', authenticateToken, createLoan);
router.get('/api/customer-applications/my-applications', authenticateToken, getMyLoans);
router.get('/api/customer-applications', getAllLoans);

// Clear, canonical loans endpoints
router.post('/api/loans', authenticateToken, createLoan);
router.get('/api/loans/customer/:customerId', getLoansByCustomer); // Temporarily removed auth for testing

module.exports = router;
