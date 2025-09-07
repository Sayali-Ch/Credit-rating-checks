const mongoose = require('mongoose');

/**
 * Collection: user_details
 * User profile with ML predictions
 */
const userDetailSchema = new mongoose.Schema({
  // Basic Identification
  customer_id: { type: String, required: true, index: true, unique: true }, // This will be the PAN card number
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  occupation: { type: String },
  annual_income: { type: Number },
  
  // ML Predictions
  credit_score: { type: Number },
  credit_category: { type: String },
  lending_outlook: { type: String },
  positive_summary: { type: String },
  negative_summary: { type: String },
  recommendation_tips: { type: String },
  
  // System Fields
  status: { type: String, default: 'active' },
  updated_at: { type: Date, default: Date.now },
  last_updated: { type: Date, default: Date.now }
  
}, { 
  collection: 'user_details',
  timestamps: true 
});

module.exports = mongoose.model('UserDetail', userDetailSchema);
