const mongoose = require('mongoose');

/**
 * Collection: govdatabase
 * Government database records that contain financial history
 */
const govDatabaseSchema = new mongoose.Schema({
  ID: { type: String },
  Customer_ID: { type: String, required: true, index: true, unique: true },
  Month: { type: String },
  Name: { type: String },
  Age: { type: Number },
  SSN: { type: String },
  Occupation: { type: String },
  Annual_Income: { type: Number },
  Monthly_Inhand_Salary: { type: Number },
  Num_Bank_Accounts: { type: Number },
  Num_Credit_Card: { type: Number },
  Interest_Rate: { type: Number },
  Num_of_Loan: { type: Number },
  Type_of_Loan: { type: String },
  Delay_from_due_date: { type: Number },
  Num_of_Delayed_Payment: { type: Number },
  Changed_Credit_Limit: { type: Number },
  Num_Credit_Inquiries: { type: Number },
  Credit_Mix: { type: String },
  Outstanding_Debt: { type: Number },
  Credit_Utilization_Ratio: { type: Number },
  Credit_History_Age: { type: String }, // keep as string ("27 Years and 3 Months")
  Payment_of_Min_Amount: { type: String },
  Total_EMI_per_month: { type: Number },
  Amount_invested_monthly: { type: Number },
  Payment_Behaviour: { type: String },
  Monthly_Balance: { type: Number }
}, { 
  collection: 'govdatabase',
  timestamps: false 
});

module.exports = mongoose.model('GovDatabase', govDatabaseSchema);
