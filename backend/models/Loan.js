const mongoose = require('mongoose');

/**
 * Collection: loans
 */
const loanSchema = new mongoose.Schema({
  customerId:   { type: String, required: true, index: true },
  loanType:     { type: String, required: true },
  appliedDate:  { type: Date, default: Date.now },
  status:       { type: String, default: 'Applied' },
  customerName: { type: String },
  customerEmail:{ type: String },
  creditScore:  { type: Number }
}, { collection: 'loans' });

module.exports = mongoose.model('Loan', loanSchema);
