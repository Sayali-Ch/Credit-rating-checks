// Test script to demonstrate loan application submission
// Run this with: node testLoanApplication.js

const testLoanApplications = [
  // Home Loan Application
  {
    customer_id: "CUS_0x17419", // Nancy Miller
    loan_type: "home-loan",
    loan_data: {
      propertyValue: 8000000,
      loanAmount: 6000000,
      downPayment: 2000000,
      propertyType: "apartment"
    }
  },
  
  // Car Loan Application
  {
    customer_id: "CUS_0x18fc6", // Jennifer Harris
    loan_type: "car-loan",
    loan_data: {
      vehicleType: "new",
      vehicleValue: 1200000,
      loanAmount: 900000,
      downPayment: 300000
    }
  },
  
  // Personal Loan Application
  {
    customer_id: "CUS_0x1b3d1", // Michael Thompson
    loan_type: "personal-loan",
    loan_data: {
      loanPurpose: "debt-consolidation",
      monthlyIncome: 75000,
      loanAmount: 500000,
      existingEMI: 15000
    }
  },
  
  // Education Loan Application
  {
    customer_id: "CUS_0x1d803", // Jason Thompson
    loan_type: "education-loan",
    loan_data: {
      admissionStatus: "confirmed",
      courseType: "engineering",
      courseDuration: 4,
      feeStructure: "semester-wise",
      coApplicant: "parent"
    }
  },
  
  // Business Loan Application
  {
    customer_id: "CUS_0x17419", // Nancy Miller - second application
    loan_type: "business-loan",
    loan_data: {
      businessType: "software",
      gstRegistered: true,
      monthlyRevenue: 800000,
      loanAmount: 2000000,
      businessAge: 5
    }
  }
];

async function testLoanApplication(applicationData) {
  try {
    console.log(`\n🧪 Testing loan application for ${applicationData.customer_id}:`);
    console.log(`   Loan Type: ${applicationData.loan_type}`);
    console.log(`   Loan Amount: ₹${applicationData.loan_data.loanAmount?.toLocaleString() || 'N/A'}`);
    
    const response = await fetch('http://localhost:5000/api/loans/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`   ✅ SUCCESS: ${result.message}`);
      console.log(`   📋 Application ID: ${result.application._id}`);
      console.log(`   🎯 Eligibility: ${result.application.eligibility.status}`);
      console.log(`   📊 Credit Score: ${result.application.eligibility.current_score}/${result.application.eligibility.required_score}`);
    } else {
      const error = await response.json();
      console.log(`   ❌ ERROR: ${error.message}`);
      if (error.errors) {
        console.log(`   📝 Validation Errors:`, error.errors);
      }
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Starting Loan Application API Tests...\n');
  
  for (const application of testLoanApplications) {
    await testLoanApplication(application);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
  
  console.log('\n✅ All tests completed!');
}

// Run the tests
runTests();
