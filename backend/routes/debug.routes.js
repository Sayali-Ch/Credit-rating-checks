const router = require('express').Router();
const { debugUsers, debugUserDetails, debugLoans } = require('../controllers/debugController');

router.get('/debug-users', debugUsers);
router.get('/debug-user-details', debugUserDetails);
router.get('/debug-loans', debugLoans);

module.exports = router;
