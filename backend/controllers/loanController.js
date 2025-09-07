const Loan = require('../models/Loan');
const User = require('../models/User');
const UserDetail = require('../models/UserDetail');

// POST /api/customer-applications   (compat) OR POST /api/loans
exports.createLoan = async (req, res, next) => {
  try {
    const customerId = req.user.customerId;
    const { loanType, creditScore } = req.body;

    const user = await User.findOne({ customer_id: customerId });
    const details = await UserDetail.findOne({ customer_id: customerId });

    const doc = await Loan.create({
      customerId,
      loanType,
      appliedDate: new Date(),
      status: 'Applied',
      customerName: details?.name || user?.name,
      customerEmail: details?.email || user?.email,
      creditScore: creditScore ?? details?.credit_score
    });

    return res.status(201).json({ message: 'Loan application submitted successfully', application: doc });
  } catch (err) { next(err); }
};

// GET /api/loans/customer/:customerId
exports.getLoansByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const loans = await Loan.find({ customerId }).sort({ appliedDate: -1 });
    return res.json({ success: true, loans });
  } catch (err) { next(err); }
};

// GET /api/customer-applications/my-applications  (compat)
exports.getMyLoans = async (req, res, next) => {
  try {
    const customerId = req.user.customerId;
    const loans = await Loan.find({ customerId }).sort({ appliedDate: -1 });
    return res.json(loans);
  } catch (err) { next(err); }
};

// GET /api/customer-applications  (compat: admin listing -> all loans)
exports.getAllLoans = async (_req, res, next) => {
  try {
    const loans = await Loan.find({}).sort({ appliedDate: -1 });
    return res.json(loans);
  } catch (err) { next(err); }
};
