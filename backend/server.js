const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// JWT Secret key (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

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
  console.log('Customer login request:', { email });
  
  try {
    // Look for user in allusers collection
    const user = await mongoose.connection.db.collection('allusers').findOne({ 
      email: email,
      isadmin: "no" // Ensure we're only getting customer accounts
    });
    
    console.log('User found:', user ? { customer_id: user.customer_id, email: user.email, name: user.name } : 'No user found');
    
    if (user) {
      let passwordMatch = false;
      
      // Check if password is hashed (bcrypt hashes start with $2b$, $2a$, or $2y$)
      if (user.password && user.password.startsWith('$2')) {
        // Password is hashed, use bcrypt compare
        passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Using bcrypt comparison for hashed password');
      } else {
        // Password might be plain text (legacy data), compare directly
        passwordMatch = (password === user.password);
        console.log('Using plain text comparison for legacy password');
        
        // If login is successful with plain text, update to hashed password
        if (passwordMatch) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await mongoose.connection.db.collection('allusers').updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
          );
          console.log('Updated plain text password to hashed for user:', email);
        }
      }
      
      if (passwordMatch) {
        // Generate JWT token with proper payload
        const tokenPayload = {
          customerId: user.customer_id,
          email: user.email,
          name: user.name,
          role: 'customer'
        };
        
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
        
        console.log('Login successful for customer:', user.customer_id);
        
        res.status(200).json({ 
          message: 'Login successful', 
          user: {
            customerId: user.customer_id,
            email: user.email,
            name: user.name,
            role: 'customer'
          },
          token: token
        });
      } else {
        console.log('Password mismatch for user:', email);
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      console.log('No user found with email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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
      // Generate JWT token for admin
      const token = generateToken({
        email: admin.email,
        name: admin.name,
        role: 'admin',
        customer_id: admin.employeeId || admin.email
      });
      
      res.status(200).json({ 
        message: 'Admin login successful', 
        admin,
        token,
        role: 'admin'
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Customer Signup Endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if user already exists in allusers collection
    const existingUser = await mongoose.connection.db.collection('allusers').findOne({
      email: email
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Generate unique customer ID
    const generateCustomerId = () => {
      const randomHex = Math.random().toString(16).substr(2, 5);
      return `CUS_0x${randomHex}`;
    };
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user data for allusers collection
    const userData = {
      customer_id: generateCustomerId(),
      name: name,
      email: email,
      password: hashedPassword,
      isadmin: "no" // Default to no for customer signup
    };
    
    // Insert into allusers collection
    const result = await mongoose.connection.db.collection('allusers').insertOne(userData);
    
    console.log('New user created:', {
      _id: result.insertedId,
      customer_id: userData.customer_id,
      name: userData.name,
      email: userData.email
    });
    
    // Return success response (don't return password)
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: result.insertedId,
        customer_id: userData.customer_id,
        name: userData.name,
        email: userData.email,
        isadmin: userData.isadmin
      }
    });
    
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error creating account', error: err.message });
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

// Customer Application schema for customer_appln collection
const customerApplicationSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  loanType: { type: String, required: true },
  appliedDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Applied' },
  customerName: { type: String },
  customerEmail: { type: String },
  creditScore: { type: Number }
}, { strict: false });

const CustomerApplication = mongoose.model('CustomerApplication', customerApplicationSchema, 'customer_appln');

// JWT Middleware for token verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // Add user info to request object
    next();
  });
};

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      customerId: user.customer_id || user.Customer_ID || user.email,
      email: user.email,
      name: user.name,
      role: user.role || 'customer'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

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

// Create customer loan application endpoint
app.post('/api/customer-applications', authenticateToken, async (req, res) => {
  try {
    // Extract customer ID from JWT token
    const customerId = req.user.customerId;
    const { loanType, loanParameters, creditScore } = req.body;
    
    console.log('Customer application request from token:', {
      customerId: req.user.customerId,
      email: req.user.email,
      name: req.user.name,
      loanType,
      loanParameters
    });
    
    // Get additional customer data from the database for completeness
    const customer = await User.findOne({ 
      $or: [
        { customer_id: customerId },
        { Customer_ID: customerId },
        { email: req.user.email }
      ]
    });

    // Get user details for complete information
    const userDetails = await mongoose.connection.db.collection('users_details').findOne({
      customer_id: customerId
    });
    
    // Create loan application data
    const loanApplication = {
      customerId: customerId,
      loanType: loanType,
      appliedDate: new Date(),
      status: 'Applied',
      customerName: userDetails?.name || req.user.name || customer?.name,
      customerEmail: userDetails?.email || req.user.email,
      creditScore: userDetails?.credit_score || customer?.credit_score || creditScore,
      loanParameters: loanParameters || {}
    };
    
    // Save to loans collection
    const result = await mongoose.connection.db.collection('loans').insertOne(loanApplication);
    
    console.log('Loan application saved to loans collection:', result.insertedId);
    
    res.status(201).json({ 
      message: 'Loan application submitted successfully', 
      application: { ...loanApplication, _id: result.insertedId }
    });
  } catch (err) {
    console.error('Error creating loan application:', err);
    res.status(500).json({ message: 'Error submitting application', error: err });
  }
});

// Get all customer applications endpoint
app.get('/api/customer-applications', async (req, res) => {
  try {
    const applications = await CustomerApplication.find({}).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching customer applications:', err);
    res.status(500).json({ message: 'Error fetching applications', error: err });
  }
});

// Get customer applications by customer ID from JWT token
app.get('/api/customer-applications/my-applications', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customerId;
    console.log('Fetching applications for customer:', customerId);
    
    const applications = await CustomerApplication.find({ customerId }).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching customer applications:', err);
    res.status(500).json({ message: 'Error fetching customer applications', error: err });
  }
});

// Token validation endpoint
app.get('/api/validate-token', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: req.user,
    message: 'Token is valid' 
  });
});

// Get user profile from JWT token
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.customerId;
    
    const user = await User.findOne({ 
      $or: [
        { customer_id: customerId },
        { Customer_ID: customerId },
        { email: req.user.email }
      ]
    });
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Error fetching user profile', error: err });
  }
});

// Check if user profile is complete
app.get('/api/check-profile/:customerId', authenticateToken, async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    // Check in users_details collection
    const userDetails = await mongoose.connection.db.collection('users_details').findOne({
      customer_id: customerId
    });
    
    res.json({
      profileComplete: !!userDetails,
      userDetails: userDetails
    });
  } catch (err) {
    console.error('Error checking profile completion:', err);
    res.status(500).json({ message: 'Error checking profile', error: err });
  }
});

// Complete user profile
app.post('/api/complete-profile', authenticateToken, async (req, res) => {
  try {
    const { customer_id, name, email, phone, address, occupation, annual_income, pan_card_number } = req.body;
    
    // Insert/update in users_details collection
    const profileData = {
      customer_id,
      name,
      email,
      phone,
      address,
      occupation,
      annual_income,
      pan_card_number,
      status: 'Pending Review',
      updated_at: new Date(),
      last_updated: new Date()
    };
    
    await mongoose.connection.db.collection('users_details').updateOne(
      { customer_id },
      { $set: profileData },
      { upsert: true }
    );
    
    res.json({
      success: true,
      message: 'Profile completed successfully',
      profile: profileData
    });
  } catch (err) {
    console.error('Error completing profile:', err);
    res.status(500).json({ message: 'Error saving profile', error: err });
  }
});

// Get loan applications for a customer
app.get('/api/loans/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    const loans = await mongoose.connection.db.collection('loans').find({
      customerId: customerId
    }).toArray();
    
    res.json({
      success: true,
      loans: loans
    });
  } catch (err) {
    console.error('Error fetching loan applications:', err);
    res.status(500).json({ message: 'Error fetching loans', error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
