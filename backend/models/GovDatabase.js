const mongoose = require('mongoose');

/**
 * Collection: govdatabase
 * Government database records that contain financial history
 */
const govDatabaseSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, index: true, unique: true }, // PAN card number
  month: { type: String },
  name: { type: String },
  age: { type: Number },
  ssn: { type: String },
  occupation: { type: String },
  annual_income: { type: Number },
  monthly_inhand_salary: { type: Number },
  num_bank_accounts: { type: Number },
  num_credit_card: { type: Number },
  interest_rate: { type: Number },
  num_of_loan: { type: Number },
  type_of_loan: { type: String },
  delay_from_due_date: { type: Number },
  num_of_delayed_payment: { type: Number },
  changed_credit_limit: { type: String },
  num_credit_inquiries: { type: Number },
  credit_mix: { type: String },
  outstanding_debt: { type: Number },
  credit_utilization_ratio: { type: Number },
  credit_history_age: { type: Number },
  payment_of_min_amount: { type: String },
  total_emi_per_month: { type: Number },
  amount_invested_monthly: { type: Number },
  payment_behaviour: { type: String },
  monthly_balance: { type: Number }
}, { 
  collection: 'govdatabase',
  timestamps: false 
});

module.exports = mongoose.model('GovDatabase', govDatabaseSchema);
