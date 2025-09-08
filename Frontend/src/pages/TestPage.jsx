import React from 'react';

function TestPage() {
  console.log("TestPage component rendering");
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'lightgreen',
      padding: '20px',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <h1>TEST PAGE IS WORKING!</h1>
      <p>Current URL: {window.location.pathname}</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <button onClick={() => window.location.href = '/home'}>
        Go to Home
      </button>
    </div>
  );
}

export default TestPage;
