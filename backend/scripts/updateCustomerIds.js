const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const UserDetail = require('../models/UserDetail');

async function updateCustomerIds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all user details that have PAN cards
    const userDetails = await UserDetail.find({ pan_card_number: { $exists: true, $ne: null } });
    console.log(`Found ${userDetails.length} user details with PAN cards`);

    for (const detail of userDetails) {
      const oldCustomerId = detail.customer_id;
      const newCustomerId = detail.pan_card_number;

      if (oldCustomerId === newCustomerId) {
        console.log(`✓ User ${detail.name} already has PAN as customer_id: ${newCustomerId}`);
        continue;
      }

      // Update the user in allusers collection
      const userUpdate = await User.findOneAndUpdate(
        { customer_id: oldCustomerId },
        { customer_id: newCustomerId },
        { new: true }
      );

      if (userUpdate) {
        console.log(`✓ Updated user ${userUpdate.name} customer_id: ${oldCustomerId} → ${newCustomerId}`);
      }

      // Update the user detail
      const detailUpdate = await UserDetail.findOneAndUpdate(
        { customer_id: oldCustomerId },
        { customer_id: newCustomerId },
        { new: true }
      );

      if (detailUpdate) {
        console.log(`✓ Updated user detail customer_id: ${oldCustomerId} → ${newCustomerId}`);
      }
    }

    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

updateCustomerIds();
