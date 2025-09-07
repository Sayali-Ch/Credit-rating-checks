const bcrypt = require('bcryptjs');
const User = require('../models/User');
const UserDetail = require('../models/UserDetail');
const GovDatabase = require('../models/GovDatabase');
const { generateToken } = require('../utils/jwt');
const { generateCustomerId } = require('../utils/id');

// POST /api/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, isadmin } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      customer_id: generateCustomerId(),
      name,
      email,
      password: hashed,
      isadmin: (isadmin || 'no').toLowerCase() === 'yes' ? 'yes' : 'no'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        _id: user._id,
        customer_id: user.customer_id,
        name: user.name,
        email: user.email,
        isadmin: user.isadmin
      }
    });
  } catch (err) { next(err); }
};

// POST /login  (customer or admin)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login request:', { email });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    let ok = false;
    if (user.password?.startsWith('$2')) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      // legacy plaintext support (if any)
      ok = (password === user.password);
      if (ok) {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();
        console.log('Upgraded plaintext password to hash for', email);
      }
    }
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const role = user.isadmin?.toLowerCase() === 'yes' ? 'admin' : 'customer';
    const token = generateToken({
      customerId: user.customer_id,
      email: user.email,
      name: user.name,
      role
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        customerId: user.customer_id,
        email: user.email,
        name: user.name,
        role
      },
      token
    });
  } catch (err) { next(err); }
};

// POST /admin-login  (explicit admin gate)
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, isadmin: 'yes' });
    if (!admin) return res.status(401).json({ message: 'Invalid admin credentials' });

    const ok = admin.password?.startsWith('$2')
      ? await bcrypt.compare(password, admin.password)
      : password === admin.password;

    if (!ok) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = generateToken({
      customerId: admin.customer_id,
      email: admin.email,
      name: admin.name,
      role: 'admin'
    });

    return res.status(200).json({
      message: 'Admin login successful',
      admin: {
        customerId: admin.customer_id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      },
      token,
      role: 'admin'
    });
  } catch (err) { next(err); }
};

// GET /api/validate-token
exports.validateToken = async (req, res) => {
  res.json({ valid: true, user: req.user, message: 'Token is valid' });
};
