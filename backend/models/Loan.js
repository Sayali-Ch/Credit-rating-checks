const mongoose = require('mongoose');

/**
 * Collection: loans
 */
const loanSchema = new mongoose.Schema({
  customer_id:   { type: String, required: true, index: true },
  loan_type:     { type: String, required: true },
  loan_data:     { type: mongoose.Schema.Types.Mixed }, // Object containing loan-specific parameters
  applied_date:  { type: Date, default: Date.now },
  status:        { type: String, default: 'Applied' },
  created_at:    { type: Date, default: Date.now },
  updated_at:    { type: Date, default: Date.now }
}, { collection: 'loans' });

module.exports = mongoose.model('Loan', loanSchema);
