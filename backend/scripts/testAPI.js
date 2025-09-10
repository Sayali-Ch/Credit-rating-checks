const axios = require('axios');

// Test the loan applications API endpoint
const testLoanApplicationsAPI = async () => {
  try {
    console.log('🧪 Testing Loan Applications API...\n');

    // First, let's try to login and get a token
    const loginData = {
      username: "admin", // or whatever valid credentials you have
      password: "password123"
    };

    let token = null;
    
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/login', loginData);
      token = loginResponse.data.token;
      console.log('✅ Login successful, got token');
    } catch (loginError) {
      console.log('⚠️ Login failed, testing without authentication...');
      console.log('Error:', loginError.response?.data?.message || loginError.message);
    }

    // Test the loan applications endpoint
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.get('http://localhost:5000/api/applications', { headers });
    
    console.log('📊 API Response Status:', response.status);
    console.log('📋 Number of applications:', response.data.length);
    console.log('\n🏦 LOAN APPLICATIONS DATA:');
    
    response.data.forEach((app, index) => {
      console.log(`\n${index + 1}. Customer: ${app.customer_name || 'N/A'}`);
      console.log(`   ID: ${app.customer_id}`);
      console.log(`   Credit Score: ${app.credit_score}`);
      console.log(`   Loan Type: ${app.loan_type}`);
      console.log(`   Required Score: ${app.required_credit_score}`);
      console.log(`   Eligible: ${app.eligible ? '✅ YES' : '❌ NO'}`);
      console.log(`   Applied: ${app.applied_date}`);
    });

    if (response.data.length === 0) {
      console.log('⚠️ No data returned - check database connection and data');
    }

  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('URL:', error.config?.url);
  }
};

// Run the test
testLoanApplicationsAPI();
