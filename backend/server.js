const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Use your MongoDB connection string and test database
const uri = 'mongodb+srv://creditlendingdb:creditlendingdb1@credit-lending-cluster.ei4dukf.mongodb.net/test';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  customer_id: String,
  name: String,
  email: String,
  phone: Number,
  address: String,
  occupation: String,
  annual_income: Number,
  pan_card_number: String,
  password: String,
  role: String,
  Customer_ID: String,
  credit_score: Number,
  Credit_Category: String,
  Lending_Outlook: String,
  negative_summary: String,
  positive_summary: String,
  recommendation_tips: String
}, { strict: false }); // Allow additional fields

const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String
}, { strict: false });

const User = mongoose.model('User', userSchema, 'users'); // using users collection
const Admin = mongoose.model('Admin', adminSchema, 'adminlogin'); // using adminlogin collection name

// Debug endpoint to list all users
app.get('/debug-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// Debug endpoint to list all admins
app.get('/debug-admins', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admins', error: err });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password });
  try {
    const user = await User.findOne({ email, password });
    console.log('Query result:', user);
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Admin login endpoint
app.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Admin login request:', { email, password });
  try {
    const admin = await Admin.findOne({ email, password });
    console.log('Admin query result:', admin);
    if (admin) {
      res.status(200).json({ message: 'Admin login successful', admin });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Create sample admin endpoint (for testing)
app.post('/create-admin', async (req, res) => {
  try {
    const sampleAdmin = new Admin({
      employeeId: 'EMP001',
      name: 'John Smith',
      email: 'admin@bank.com',
      password: 'admin123',
      role: 'admin',
      department: 'Credit Assessment',
      access_level: 'high'
    });
    
    const savedAdmin = await sampleAdmin.save();
    res.status(201).json({ message: 'Sample admin created', admin: savedAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err });
  }
});

// Update user profile endpoint
app.put('/update-profile', async (req, res) => {
  const { email, name, phone, address, occupation, annual_income, pan_card_number } = req.body;
  console.log('Profile update request:', req.body);
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        phone,
        address,
        occupation,
        annual_income,
        pan_card_number
      },
      { new: true }
    );
    
    if (updatedUser) {
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Application schema matching your admin collection structure
const applicationSchema = new mongoose.Schema({
  customerId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  occupation: { type: String },
  pancardNumber: { type: String },
  annualIncome: { type: String },
  creditScore: { type: Number, required: true },
  reviewedBy: { type: String },
  reviewedDate: { type: Date },
  status: { type: String, enum: ['Approved', 'Rejected', 'Under Scrutiny', 'Pending'], default: 'Under Scrutiny' },
  updatedAt: { type: Date, default: Date.now },
  // Fields expected by frontend
  loanType: { type: String, default: 'Personal Loan' },
  lendingOutlook: { type: String, default: 'Standard' },
  requiredScore: { type: Number, default: 650 }
}, { strict: false }); // Allow additional fields

const Application = mongoose.model('Application', applicationSchema, 'admin'); // Use 'admin' collection

// Get all applications endpoint
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Error fetching applications', error: err });
  }
});

// Update application status endpoint
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status, lastUpdated: new Date() },
      { new: true }
    );
    
    if (updatedApplication) {
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ message: 'Error updating application status', error: err });
  }
});

// Get user profile by customerId endpoint
app.get('/api/users/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const user = await Application.findOne({ customerId });
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Error fetching user profile', error: err });
  }
});

// Create sample applications endpoint (for testing)
app.post('/api/create-sample-applications', async (req, res) => {
  try {
    const sampleApplications = [
      {
        customerName: 'Alice Williams',
        email: 'alice.williams@email.com',
        customerId: 'CUST001',
        creditScore: 720,
        loanType: 'Home Loan',
        loanAmount: 500000,
        requiredMinimum: 700,
        status: 'Approved'
      },
      {
        customerName: 'Liam Smith',
        email: 'liam.smith@email.com',
        customerId: 'CUST002',
        creditScore: 640,
        loanType: 'Car Loan',
        loanAmount: 200000,
        requiredMinimum: 650,
        status: 'Rejected'
      },
      {
        customerName: 'Emma Johnson',
        email: 'emma.johnson@email.com',
        customerId: 'CUST003',
        creditScore: 690,
        loanType: 'Personal Loan',
        loanAmount: 100000,
        requiredMinimum: 680,
        status: 'Approved'
      },
      {
        customerName: 'Noah Brown',
        email: 'noah.brown@email.com',
        customerId: 'CUST004',
        creditScore: 560,
        loanType: 'Education Loan',
        loanAmount: 300000,
        requiredMinimum: 600,
        status: 'Rejected'
      },
      {
        customerName: 'Olivia Davis',
        email: 'olivia.davis@email.com',
        customerId: 'CUST005',
        creditScore: 780,
        loanType: 'Home Loan',
        loanAmount: 750000,
        requiredMinimum: 700,
        status: 'Approved'
      },
      {
        customerName: 'William Wilson',
        email: 'william.wilson@email.com',
        customerId: 'CUST006',
        creditScore: 620,
        loanType: 'Personal Loan',
        loanAmount: 150000,
        requiredMinimum: 650,
        status: 'Under Scrutiny'
      },
      {
        customerName: 'Sophia Moore',
        email: 'sophia.moore@email.com',
        customerId: 'CUST007',
        creditScore: 740,
        loanType: 'Car Loan',
        loanAmount: 400000,
        requiredMinimum: 700,
        status: 'Approved'
      },
      {
        customerName: 'James Taylor',
        email: 'james.taylor@email.com',
        customerId: 'CUST008',
        creditScore: 580,
        loanType: 'Education Loan',
        loanAmount: 250000,
        requiredMinimum: 600,
        status: 'Under Scrutiny'
      },
      {
        customerName: 'Isabella Anderson',
        email: 'isabella.anderson@email.com',
        customerId: 'CUST009',
        creditScore: 710,
        loanType: 'Home Loan',
        loanAmount: 600000,
        requiredMinimum: 700,
        status: 'Approved'
      },
      {
        customerName: 'Benjamin Thomas',
        email: 'benjamin.thomas@email.com',
        customerId: 'CUST010',
        creditScore: 820,
        loanType: 'Business Loan',
        loanAmount: 1000000,
        requiredMinimum: 750,
        status: 'Under Scrutiny'
      }
    ];

    // Clear existing applications and insert new ones
    await Application.deleteMany({});
    const createdApplications = await Application.insertMany(sampleApplications);
    res.status(201).json({ 
      message: 'Sample applications created successfully', 
      count: createdApplications.length,
      applications: createdApplications 
    });
  } catch (err) {
    console.error('Error creating sample applications:', err);
    res.status(500).json({ message: 'Error creating sample applications', error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
