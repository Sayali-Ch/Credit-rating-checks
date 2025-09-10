// Simple test to check if the user endpoint is working
const testUserId = 'CUS_0x17419'; // Nancy Miller

console.log(`Testing user endpoint for: ${testUserId}`);

// Using fetch to test the endpoint
fetch(`http://localhost:5000/api/users/${testUserId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token' // We'll need a real token
  }
})
.then(response => {
  console.log('Response status:', response.status);
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`HTTP ${response.status}`);
  }
})
.then(data => {
  console.log('✅ User data:', data);
})
.catch(error => {
  console.error('❌ Error:', error.message);
});
