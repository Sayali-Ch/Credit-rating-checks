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


const GovDatabase = require('../models/GovDatabase');

exports.updateProfile = async (req, res, next) => {
  try {
    const { customerId } = req.user;
    const {
      name,
      email,
      phone,
      address,
      occupation,
      annual_income,
      pan_card_number
    } = req.body;

    // Build update object for UserDetail
    const update = {
      name,
      email,
      phone,
      address,
      occupation,
      annual_income,
      pan_card_number,
      updated_at: new Date(),
      last_updated: new Date()
    };

    // Update UserDetail
    const profile = await UserDetail.findOneAndUpdate(
      { customer_id: customerId },
      { $set: update },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Map fields for GovDatabase update
    const govUpdate = {
      Name: name || profile.name,
      Occupation: occupation || profile.occupation,
      Annual_Income: annual_income !== undefined ? annual_income : profile.annual_income,
      Customer_ID: customerId
    };


    // Update GovDatabase
    await GovDatabase.findOneAndUpdate(
      { Customer_ID: customerId },
      { $set: govUpdate },
      { new: true, upsert: true } // upsert ensures entry exists if not
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (err) {
    console.error('❌ Error in updateProfile:', err);
    next(err);
  }
};


// GET /api/credit-score

exports.getCreditScore = async (req, res, next) => {
  try {
    // Extract customerId from JWT
    const { customerId } = req.user;
    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID missing from token' });
    }
    console.log(customerId);

    // Fetch customer details from govdatabase collection
    const govData = await GovDatabase.findOne({ Customer_ID: customerId });
    if (!govData) {
      return res.status(404).json({ message: 'No government database record found for this customer' });
    }

    // Prepare request body for ML backend
    const mlRequestBody = {
      ID: govData.ID?.toString() || '',
      Customer_ID: govData.Customer_ID || '',
      Month: govData.Month || '',
      Name: govData.Name || '',
      Age: govData.Age ? parseInt(govData.Age) || 0 : 0,
      SSN: govData.SSN || '',
      Occupation: govData.Occupation || '',
      Annual_Income: govData.Annual_Income ? parseFloat(govData.Annual_Income) || 0 : 0,
      Monthly_Inhand_Salary: govData.Monthly_Inhand_Salary ? parseFloat(govData.Monthly_Inhand_Salary) || 0 : 0,
      Num_Bank_Accounts: govData.Num_Bank_Accounts ? parseInt(govData.Num_Bank_Accounts) || 0 : 0,
      Num_Credit_Card: govData.Num_Credit_Card ? parseInt(govData.Num_Credit_Card) || 0 : 0,
      Interest_Rate: govData.Interest_Rate ? parseFloat(govData.Interest_Rate) || 0 : 0,
      Num_of_Loan: govData.Num_of_Loan ? parseInt(govData.Num_of_Loan) || 0 : 0,
      Type_of_Loan: govData.Type_of_Loan || '',
      Delay_from_due_date: govData.Delay_from_due_date ? parseInt(govData.Delay_from_due_date) || 0 : 0,
      Num_of_Delayed_Payment: govData.Num_of_Delayed_Payment ? parseInt(govData.Num_of_Delayed_Payment) || 0 : 0,
      Changed_Credit_Limit: govData.Changed_Credit_Limit ? parseFloat(govData.Changed_Credit_Limit) || 0 : 0,
      Num_Credit_Inquiries: govData.Num_Credit_Inquiries ? parseInt(govData.Num_Credit_Inquiries) || 0 : 0,
      Credit_Mix: govData.Credit_Mix || '',
      Outstanding_Debt: govData.Outstanding_Debt ? parseFloat(govData.Outstanding_Debt) || 0 : 0,
      Credit_Utilization_Ratio: govData.Credit_Utilization_Ratio ? parseFloat(govData.Credit_Utilization_Ratio) || 0 : 0,
      Credit_History_Age: govData.Credit_History_Age || '',
      Payment_of_Min_Amount: govData.Payment_of_Min_Amount || '',
      Total_EMI_per_month: govData.Total_EMI_per_month ? parseFloat(govData.Total_EMI_per_month) || 0 : 0,
      Amount_invested_monthly: govData.Amount_invested_monthly ? parseFloat(govData.Amount_invested_monthly) || 0 : 0,
      Payment_Behaviour: govData.Payment_Behaviour || '',
      Monthly_Balance: govData.Monthly_Balance ? parseFloat(govData.Monthly_Balance) || 0 : 0
    };

    // Send request to ML backend
    const response = await fetch('https://npn-ngqrl.ondigitalocean.app/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mlRequestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ML API error: ${response.status} - ${errorText}`);
    }

    const mlResponseData = await response.json();

    // Return ML backend response to frontend
    return res.json(mlResponseData);

  } catch (err) {
    console.error('❌ Error fetching credit score:', err);
    next(err);
  }
};


exports.saveCreditScoreData = async (req, res, next) => {
  try {
    const { customerId } = req.user;
    const mlData = req.body;

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID missing from token' });
    }

    // Map ML keys to schema keys
    const mappedData = {
      credit_score: mlData.Credit_Score,
      credit_category: mlData.Credit_Category,
      lending_outlook: mlData.Lending_Outlook,
      recommendation_tips: [
        mlData.Improvement_Tip_1,
        mlData.Improvement_Tip_2,
        mlData.Improvement_Tip_3
      ].filter(Boolean).join(', '),
      positive_summary: [
        mlData.Positive_Factor_1,
        mlData.Positive_Factor_2,
        mlData.Positive_Factor_3
      ].filter(Boolean).join(', '),
      negative_summary: [
        mlData.Risk_Factor_1,
        mlData.Risk_Factor_2,
        mlData.Risk_Factor_3
      ].filter(Boolean).join(', '),
      updated_at: new Date()
    };

    const updatedUser = await UserDetail.findOneAndUpdate(
      { customer_id: customerId },
      { $set: mappedData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found for saving ML data' });
    }

    return res.json({ success: true, message: 'ML data merged successfully', user: updatedUser });

  } catch (err) {
    console.error('❌ Error saving ML data:', err);
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

// GET /api/analytics/credit-score-distribution
exports.getCreditScoreDistribution = async (req, res, next) => {
  try {
    const UserDetail = require('../models/UserDetail');
    
    // Get all users with credit scores from user_details collection
    const users = await UserDetail.find({ 
      credit_score: { $exists: true, $ne: null } 
    }).select('credit_score');

    // Initialize distribution counters
    const distribution = {
      fair: 0,     // 550-649
      good: 0,     // 650-749
      excellent: 0 // 750-900
    };

    // Count users in each credit score range
    users.forEach(user => {
      const score = parseInt(user.credit_score);
      if (score >= 550 && score <= 649) {
        distribution.fair++;
      } else if (score >= 650 && score <= 749) {
        distribution.good++;
      } else if (score >= 750 && score <= 900) {
        distribution.excellent++;
      }
    });

    // Format for chart display
    const chartData = [
      { range: "Fair (550-649)", count: distribution.fair },
      { range: "Good (650-749)", count: distribution.good },
      { range: "Excellent (750-900)", count: distribution.excellent }
    ];

    return res.json({
      success: true,
      totalUsers: users.length,
      distribution: chartData
    });
  } catch (err) {
    console.error('Error fetching credit score distribution:', err);
    next(err);
  }
};


