// Simple test to check if our API returns real data
const http = require('http');

const testAPI = () => {
  console.log('🧪 Testing Loan Applications API...\n');

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/applications',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const applications = JSON.parse(data);
        console.log(`📋 Number of applications: ${applications.length}\n`);
        
        if (applications.length > 0) {
          console.log('🏦 LOAN APPLICATIONS (First 3):');
          applications.slice(0, 3).forEach((app, index) => {
            console.log(`\n${index + 1}. Customer: ${app.customer_name || 'N/A'}`);
            console.log(`   ID: ${app.customer_id}`);
            console.log(`   Credit Score: ${app.credit_score}`);
            console.log(`   Loan Type: ${app.loan_type}`);
            console.log(`   Required Score: ${app.required_credit_score}`);
            console.log(`   Eligible: ${app.eligible ? '✅ YES' : '❌ NO'}`);
          });
          
          console.log('\n✅ SUCCESS: API is returning real database data!');
        } else {
          console.log('⚠️ No applications returned - check database connection');
        }
      } catch (error) {
        console.error('❌ Error parsing response:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });

  req.setTimeout(5000, () => {
    console.error('❌ Request timeout');
    req.destroy();
  });

  req.end();
};

// Wait a moment for server to be ready, then test
setTimeout(testAPI, 2000);
