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

const User = mongoose.model('User', userSchema, collectionName);

// Debug endpoint to list all users
app.get('/debug-users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
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
