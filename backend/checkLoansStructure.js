const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://creditlendingdb:creditlendingdb1@credit-lending-cluster.ei4dukf.mongodb.net/test?retryWrites=true&w=majority&appName=credit-lending-cluster';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkLoansCollection = async () => {
  try {
    await connectDB();
    
    // Check loans collection
    const db = mongoose.connection.db;
    const loansCollection = db.collection('loans');
    
    const loanCount = await loansCollection.countDocuments();
    console.log(`📊 Total loans in collection: ${loanCount}`);
    
    if (loanCount > 0) {
      const sampleLoan = await loansCollection.findOne();
      console.log('📝 Sample loan document structure:');
      console.log(JSON.stringify(sampleLoan, null, 2));
    }
    
    console.log('✅ Check completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkLoansCollection();
