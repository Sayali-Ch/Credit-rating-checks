const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

mongoose.connect(uri, {
  dbName,
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

const User = mongoose.model('User', userSchema, collectionName);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
