const mongoose = require('mongoose');

/**
 * Collection: allusers
 * Fields (example):
 * - customer_id: "CUS_0x17419"
 * - name: "Nancy Miller"
 * - email: "nancy.miller@example.com"
 * - password: bcrypt hash
 * - isadmin: "no" | "yes"
 */
const userSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, index: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, index: true },
  password:    { type: String, required: true },
  isadmin:     { type: String, enum: ['no', 'yes'], default: 'no', index: true }
}, { timestamps: true, collection: 'allusers' });

module.exports = mongoose.model('User', userSchema);

