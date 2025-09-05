const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'test';

mongoose.connect(MONGODB_URI, {
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  console.log('Database:', DB_NAME);
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define flexible schema for admin collection
const adminSchema = new mongoose.Schema({}, { 
  strict: false, // Allow any fields
  collection: 'admin' // Explicitly set collection name
});

const Admin = mongoose.model('Admin', adminSchema);

// API Routes

// Get all applications from admin collection
app.get('/api/applications', async (req, res) => {
  try {
    console.log('Fetching applications from admin collection...');
    
    const applications = await Admin.find({});
    
    console.log(`Found ${applications.length} records in admin collection`);
    
    // Transform the data to match the expected application format
    const transformedApplications = applications.map((record, index) => {
      return {
        id: record._id?.toString() || (index + 1).toString(),
        customerId: record.customerId || record.customer_id || record.Customer_ID || (index + 1).toString(),
        name: record.name || 'Unknown',
        email: record.email || '',
        creditScore: record.creditScore || record.credit_score || 0,
        loanType: record.loanType || record.loan_type || 'Personal',
        amount: record.amount || record.loan_amount || record.annualIncome || '$0',
        status: record.status || determineStatus(record.creditScore || record.credit_score),
        appliedDate: record.appliedDate || record.applied_date || record.reviewedDate || record.createdAt || new Date().toISOString(),
        phone: record.phone || '',
        address: record.address || '',
        occupation: record.occupation || '',
        annualIncome: record.annualIncome || record.annual_income || 0,
        panCardNumber: record.pancardNumber || record.pan_card_number || '',
        creditCategory: record.creditCategory || record.Credit_Category || '',
        lendingOutlook: record.lendingOutlook || record.Lending_Outlook || '',
        negativeSummary: record.negativeSummary || record.negative_summary || '',
        positiveSummary: record.positiveSummary || record.positive_summary || '',
        recommendationTips: record.recommendationTips || record.recommendation_tips || '',
        reviewedBy: record.reviewedBy || '',
        reviewedDate: record.reviewedDate || '',
        requiredScore: 650 // Default required score
      };
    });

    res.json(transformedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch applications', 
      message: error.message 
    });
  }
});

// Helper function to determine status based on credit score
function determineStatus(creditScore) {
  if (!creditScore) return 'Under Scrutiny';
  
  if (creditScore >= 750) return 'Approved';
  else if (creditScore >= 650) return 'Under Scrutiny';
  else return 'Rejected';
}

// Update application status
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating application ${id} status to ${status}`);

    const updatedApplication = await Admin.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ 
      message: 'Status updated successfully', 
      application: updatedApplication 
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ 
      error: 'Failed to update status', 
      message: error.message 
    });
  }
});

// Get single application by ID
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Admin.findById(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ 
      error: 'Failed to fetch application', 
      message: error.message 
    });
  }
});

// Debug endpoint to see raw data
app.get('/api/debug/admin', async (req, res) => {
  try {
    const rawData = await Admin.find({}).limit(5);
    res.json({
      count: await Admin.countDocuments(),
      sampleRecords: rawData
    });
  } catch (error) {
    console.error('Error fetching debug data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch debug data', 
      message: error.message 
    });
  }
});

// Get user profile by customer ID
app.get('/api/users/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    console.log(`Fetching user profile for customerId: ${customerId}`);
    
    const user = await Admin.findOne({ 
      $or: [
        { customerId: customerId },
        { customer_id: customerId },
        { Customer_ID: customerId }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found', 
        message: `No user found with customerId: ${customerId}` 
      });
    }

    // Transform the user data for profile view
    const transformedUser = {
      id: user._id?.toString(),
      customerId: user.customerId || user.customer_id || user.Customer_ID,
      name: user.name || 'Unknown',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      occupation: user.occupation || '',
      annualIncome: user.annualIncome || user.annual_income || 0,
      panCardNumber: user.pancardNumber || user.pan_card_number || '',
      creditScore: user.creditScore || user.credit_score || 0,
      loanType: user.loanType || user.loan_type || 'Personal',
      amount: user.amount || user.loan_amount || user.annualIncome || '$0',
      status: user.status || determineStatus(user.creditScore || user.credit_score),
      appliedDate: user.appliedDate || user.applied_date || user.reviewedDate || user.createdAt,
      creditCategory: user.creditCategory || user.Credit_Category || '',
      lendingOutlook: user.lendingOutlook || user.Lending_Outlook || '',
      negativeSummary: user.negativeSummary || user.negative_summary || '',
      positiveSummary: user.positiveSummary || user.positive_summary || '',
      recommendationTips: user.recommendationTips || user.recommendation_tips || '',
      reviewedBy: user.reviewedBy || '',
      reviewedDate: user.reviewedDate || '',
      requiredScore: 650
    };

    console.log(`Found user profile for customerId: ${customerId}`);
    res.json(transformedUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile', 
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Dashboard Backend API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Dashboard Backend API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Applications API: http://localhost:${PORT}/api/applications`);
});

module.exports = app;
