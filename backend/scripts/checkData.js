const mongoose = require('mongoose');

// Connect to MongoDB Atlas test database (same as your main app)
const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://creditlendingdb:creditlendingdb1@credit-lending-cluster.ei4dukf.mongodb.net/test?retryWrites=true&w=majority&appName=credit-lending-cluster';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas test database');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// UserDetail Schema
const userDetailSchema = new mongoose.Schema({}, { collection: 'user_details', strict: false });
const UserDetail = mongoose.model('UserDetail', userDetailSchema);

// Loan Schema  
const loanSchema = new mongoose.Schema({}, { collection: 'loans', strict: false });
const Loan = mongoose.model('Loan', loanSchema);

// Check data
const checkData = async () => {
  try {
    console.log('\n📊 CHECKING DATABASE COLLECTIONS:\n');
    
    // Check user_details
    const userDetails = await UserDetail.find({}, { customer_id: 1, name: 1, credit_score: 1 });
    console.log('👥 USER DETAILS COLLECTION:');
    console.log(`   Found ${userDetails.length} records`);
    userDetails.forEach(user => {
      console.log(`   - ${user.customer_id}: ${user.name} (Credit: ${user.credit_score})`);
    });
    
    console.log('\n');
    
    // Check loans
    const loans = await Loan.find({}, { customer_id: 1, loan_type: 1, applied_date: 1 });
    console.log('🏦 LOANS COLLECTION:');
    console.log(`   Found ${loans.length} records`);
    loans.forEach(loan => {
      console.log(`   - ${loan.customer_id}: ${loan.loan_type} (${loan.applied_date})`);
    });
    
    console.log('\n');
    
    // Check matches
    console.log('🔍 CHECKING MATCHES:');
    for (const loan of loans) {
      const userDetail = userDetails.find(u => u.customer_id === loan.customer_id);
      if (userDetail) {
        console.log(`   ✅ ${loan.customer_id}: ${userDetail.name} -> ${loan.loan_type}`);
      } else {
        console.log(`   ❌ ${loan.customer_id}: NO USER DETAILS FOUND for ${loan.loan_type}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await checkData();
  process.exit(0);
};

main();
