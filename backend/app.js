const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const loanRoutes = require('./routes/loans.routes');
const debugRoutes = require('./routes/debug.routes');

const app = express();
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use(authRoutes);          // /login, /admin-login, /api/signup, /api/validate-token
app.use(userRoutes);          // profile + user_details endpoints
app.use(loanRoutes);          // loans + customer-applications (compat)
app.use(debugRoutes);         // /debug/users, /debug/user-details, /debug/loans

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Error handler
app.use(errorHandler);

module.exports = app;
