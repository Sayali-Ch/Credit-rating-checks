const User = require('../models/User');
const UserDetail = require('../models/UserDetail');

// GET /api/profile  (from JWT) -> returns user_details
exports.getProfile = async (req, res, next) => {
  try {
    const { customerId, email } = req.user;
    const profile = await UserDetail.findOne({ customer_id: customerId }) ||
                    await UserDetail.findOne({ email });

    if (!profile) return res.status(404).json({ message: 'User profile not found' });
    return res.json(profile);
  } catch (err) { next(err); }
};

// GET /api/check-profile/:customerId
exports.checkProfile = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const userDetails = await UserDetail.findOne({ customer_id: customerId });
    return res.json({ profileComplete: !!userDetails, userDetails });
  } catch (err) { next(err); }
};

// POST /api/complete-profile  (upsert to user_details)
exports.completeProfile = async (req, res, next) => {
  try {
    console.log('🔍 Complete Profile Request:');
    console.log('Headers:', req.headers.authorization ? 'Bearer token present' : 'No auth header');
    console.log('User from token:', req.user);
    console.log('Request body:', req.body);

    const tokenCustomerId = req.user?.customerId;
    const {
      customer_id = tokenCustomerId,
      name, email, phone, address, occupation, annual_income,
      pan_card_number, credit_score, credit_category, lending_outlook,
      negative_summary, positive_summary, recommendation_tips, status,
      reviewed_by, reviewed_date
    } = req.body;

    // Use PAN card number as customer_id if provided (it's actually customer_id in CUS_0x format)
    const finalCustomerId = pan_card_number || customer_id;
    
    // Validate customer ID format (CUS_0x followed by alphanumeric)
    if (pan_card_number && !/^CUS_0x[A-Z0-9]+$/i.test(pan_card_number)) {
      return res.status(400).json({ 
        message: 'Invalid customer ID format. Expected format: CUS_0x followed by alphanumeric characters' 
      });
    }
    
    console.log('Using customer_id:', finalCustomerId);

    if (!finalCustomerId) return res.status(400).json({ message: 'customer_id is required' });

    // Update the User collection to use the new customer_id
    if (pan_card_number && pan_card_number !== tokenCustomerId) {
      const User = require('../models/User');
      await User.findOneAndUpdate(
        { customer_id: tokenCustomerId },
        { customer_id: pan_card_number },
        { new: true }
      );
      console.log('Updated user customer_id from', tokenCustomerId, 'to', pan_card_number);
    }

    const now = new Date();
    const update = {
      customer_id: finalCustomerId, name, email, phone, address, occupation, annual_income,
      pan_card_number, credit_score, credit_category, lending_outlook,
      negative_summary, positive_summary, recommendation_tips, status,
      reviewed_by,
      reviewed_date: reviewed_date ? new Date(reviewed_date) : undefined,
      updated_at: now,
      last_updated: now
    };

    // Drop undefined keys so we don't overwrite with undefined
    Object.keys(update).forEach(k => update[k] === undefined && delete update[k]);

    console.log('Update object:', update);

    const result = await UserDetail.findOneAndUpdate(
      { customer_id: finalCustomerId },
      { $set: update },
      { upsert: true, new: true }
    );

    console.log('✅ Profile saved successfully:', result);

    return res.json({ success: true, message: 'Profile completed successfully', profile: result });
  } catch (err) { 
    console.error('❌ Error in completeProfile:', err);
    next(err); 
  }
};

// (Optional) PUT /api/users/basic  -> update basic user doc (name only)
exports.updateUserBasic = async (req, res, next) => {
  try {
    const { customerId } = req.user;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });

    const user = await User.findOneAndUpdate(
      { customer_id: customerId },
      { name },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({
      message: 'Basic profile updated',
      user: { customer_id: user.customer_id, name: user.name, email: user.email }
    });
  } catch (err) { next(err); }
};
