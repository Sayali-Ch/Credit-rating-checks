const User = require('../models/User');
const UserDetail = require('../models/UserDetail');
const Loan = require('../models/Loan');

exports.debugUsers = async (_req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) { next(err); }
};

exports.debugUserDetails = async (_req, res, next) => {
  try {
    const details = await UserDetail.find({});
    res.json(details);
  } catch (err) { next(err); }
};

exports.debugLoans = async (_req, res, next) => {
  try {
    const loans = await Loan.find({});
    res.json(loans);
  } catch (err) { next(err); }
};
