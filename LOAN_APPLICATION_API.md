# Loan Application System Documentation

## Overview
This system allows storing loan application data in the MongoDB `loans` collection with customer information, loan type, and loan-specific parameters.

## Backend API

### Endpoint: POST /api/loans/apply

**URL:** `http://localhost:5000/api/loans/apply`

**Method:** POST

**Content-Type:** application/json

### Request Body Structure

```json
{
  "customer_id": "string (required)",
  "loan_type": "string (required)",
  "loan_data": "object (required)"
}
```

### Supported Loan Types

1. **home-loan**
2. **car-loan** 
3. **personal-loan**
4. **education-loan**
5. **business-loan**

### Loan Type Specific Parameters

#### 1. Home Loan (`home-loan`)
Required fields in `loan_data`:
```json
{
  "propertyValue": 8000000,     // Property value in rupees
  "loanAmount": 6000000,        // Requested loan amount
  "downPayment": 2000000,       // Down payment amount
  "propertyType": "apartment"   // "apartment", "house", "villa", "plot"
}
```

#### 2. Car Loan (`car-loan`)
Required fields in `loan_data`:
```json
{
  "vehicleType": "new",         // "new" or "used"
  "vehicleValue": 1200000,      // Vehicle value in rupees
  "loanAmount": 900000,         // Requested loan amount
  "downPayment": 300000         // Down payment amount
}
```

#### 3. Personal Loan (`personal-loan`)
Required fields in `loan_data`:
```json
{
  "loanPurpose": "debt-consolidation",  // Purpose of loan
  "monthlyIncome": 75000,               // Monthly income in rupees
  "loanAmount": 500000                  // Requested loan amount
}
```

#### 4. Education Loan (`education-loan`)
Required fields in `loan_data`:
```json
{
  "admissionStatus": "confirmed",       // "confirmed", "provisional", "pending"
  "courseType": "engineering",          // Type of course
  "courseDuration": 4,                  // Duration in years
  "feeStructure": "semester-wise",      // "complete", "partial", "semester-wise"
  "coApplicant": "parent"              // "parent", "spouse", "guardian", "other"
}
```

#### 5. Business Loan (`business-loan`)
Required fields in `loan_data`:
```json
{
  "businessType": "software",          // Type of business
  "gstRegistered": true,               // true or false
  "monthlyRevenue": 800000,            // Monthly revenue in rupees
  "loanAmount": 2000000,               // Requested loan amount
  "businessAge": 5                     // Business age in years
}
```

## Response Format

### Success Response (201 Created)
```json
{
  "message": "Loan application submitted successfully",
  "application": {
    "_id": "loan_application_id",
    "customer_id": "CUS_0x17419",
    "loan_type": "home-loan",
    "loan_data": { /* loan specific data */ },
    "applied_date": "2024-09-08T10:30:00.000Z",
    "status": "Applied",
    "applicant": {
      "name": "Nancy Miller",
      "credit_score": 797,
      "email": "nancy.miller@email.com"
    },
    "eligibility": {
      "eligible": true,
      "required_score": 700,
      "current_score": 797,
      "status": "Eligible"
    }
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "message": "Invalid loan data",
  "errors": ["Missing required field: propertyValue"],
  "requiredFields": ["propertyValue", "loanAmount", "downPayment", "propertyType"]
}
```

## Credit Score Requirements

- **Home Loan:** 700
- **Car Loan:** 650
- **Personal Loan:** 600
- **Education Loan:** 580
- **Business Loan:** 750

## Database Schema

The loan applications are stored in the `loans` collection with this structure:

```javascript
{
  customer_id: String (required, indexed),
  loan_type: String (required),
  loan_data: Object (mixed type for flexibility),
  applied_date: Date (default: now),
  status: String (default: 'Applied'),
  created_at: Date (default: now),
  updated_at: Date (default: now)
}
```

## Frontend Integration

Use the `LoanApplicationService` class in `/src/services/loanApplicationService.js`:

```javascript
import LoanApplicationService from '../services/loanApplicationService';

// Submit a loan application
const applicationData = {
  customer_id: "CUS_0x17419",
  loan_type: "home-loan",
  loan_data: {
    propertyValue: 8000000,
    loanAmount: 6000000,
    downPayment: 2000000,
    propertyType: "apartment"
  }
};

try {
  const result = await LoanApplicationService.submitLoanApplication(applicationData);
  console.log('Application submitted:', result);
} catch (error) {
  console.error('Submission failed:', error.message);
}
```

## Testing

1. **Start the backend server:**
   ```bash
   cd backend
   node server.js
   ```

2. **Test with curl (or PowerShell):**
   ```bash
   curl -X POST http://localhost:5000/api/loans/apply \
     -H "Content-Type: application/json" \
     -d '{
       "customer_id": "CUS_0x17419",
       "loan_type": "home-loan", 
       "loan_data": {
         "propertyValue": 8000000,
         "loanAmount": 6000000,
         "downPayment": 2000000,
         "propertyType": "apartment"
       }
     }'
   ```

3. **Verify in database:**
   - Check the `loans` collection in MongoDB
   - Applications will have eligibility automatically calculated

## Features

✅ **Validation:** Ensures required fields are provided for each loan type
✅ **Eligibility Check:** Automatically calculates eligibility based on credit score
✅ **Customer Verification:** Validates that customer exists in database
✅ **Flexible Data:** `loan_data` field can store any loan-specific parameters
✅ **Error Handling:** Comprehensive error messages and validation
✅ **Logging:** Detailed server logs for debugging

## Next Steps

To integrate this into your frontend application:

1. Create loan application forms for each loan type
2. Use the `LoanApplicationService` to submit applications
3. Handle success/error responses appropriately
4. Update the applications list to refresh after new submissions
5. Add authentication when ready (currently works without auth for testing)
