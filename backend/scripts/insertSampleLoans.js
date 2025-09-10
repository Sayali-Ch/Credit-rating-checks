const mongoose = require('mongoose');

// Connect to MongoDB Atlas test database
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

// Loan Schema
const loanSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, index: true },
  loan_type: { type: String, required: true },
  loan_data: { type: mongoose.Schema.Types.Mixed },
  applied_date: { type: Date, default: Date.now },
  status: { type: String, default: 'Applied' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { collection: 'loans' });

const Loan = mongoose.model('Loan', loanSchema);

// Sample loan data using your actual customer IDs
const sampleLoans = [
  {
    customer_id: "CUS_0x17419", // Nancy Miller - Credit Score: 797
    loan_type: "home-loan",
    loan_data: {
      propertyValue: 5000000,
      loanAmount: 4000000,
      downPayment: 1000000,
      propertyType: "apartment"
    },
    applied_date: new Date("2024-09-01T10:30:00Z")
  },
  {
    customer_id: "CUS_0x18fc6", // Jennifer Harris - Credit Score: 799
    loan_type: "car-loan", 
    loan_data: {
      vehicleType: "new",
      vehicleValue: 800000,
      loanAmount: 600000,
      downPayment: 200000
    },
    applied_date: new Date("2024-09-02T14:20:00Z")
  },
  {
    customer_id: "CUS_0x1b3d1", // Michael Thompson - Credit Score: 779
    loan_type: "personal-loan",
    loan_data: {
      purpose: "debt-consolidation",
      loanAmount: 500000,
      monthlyIncome: 62500,
      existingDebts: 15000
    },
    applied_date: new Date("2024-09-03T09:15:00Z")
  },
  {
    customer_id: "CUS_0x1d803", // Jason Thompson - Credit Score: 725
    loan_type: "education-loan",
    loan_data: {
      admissionStatus: "confirmed",
      feeStructure: "complete",
      courseDuration: 4,
      courseType: "medical",
      employmentProspects: "excellent"
    },
    applied_date: new Date("2024-09-04T11:45:00Z")
  },
  {
    customer_id: "CUS_0x17419", // Nancy Miller - Second loan
    loan_type: "business-loan",
    loan_data: {
      businessType: "software-consultancy",
      loanAmount: 2000000,
      businessPlan: "expansion",
      yearsInBusiness: 3
    },
    applied_date: new Date("2024-09-05T16:30:00Z")
  },
  {
    customer_id: "CUS_0x18fc6", // Jennifer Harris - Second loan  
    loan_type: "personal-loan",
    loan_data: {
      purpose: "home-renovation",
      loanAmount: 300000,
      monthlyIncome: 79167,
      existingDebts: 8000
    },
    applied_date: new Date("2024-09-06T08:15:00Z")
  }
];

// Insert sample data
const insertSampleLoans = async () => {
  try {
    // Clear existing loans
    await Loan.deleteMany({});
    console.log('🗑️  Cleared existing loan data');
    
    // Insert new data
    const result = await Loan.insertMany(sampleLoans);
    console.log(`✅ Inserted ${result.length} sample loans`);
    
    // Show inserted data
    const loans = await Loan.find({});
    console.log('📊 Loan records in database:');
    loans.forEach(loan => {
      console.log(`  - ${loan.customer_id}: ${loan.loan_type} (${loan.applied_date})`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting sample loans:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await insertSampleLoans();
  
  console.log('\n✅ Sample loan data inserted successfully!');
  console.log('🔄 Backend server will automatically pick up the changes');
  process.exit(0);
};

main();
