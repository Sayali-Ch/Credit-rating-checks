# Loan Application System - Database Integration

## Overview
The loan application system now fetches data from two collections:
- `user_details` - Contains customer information and credit scores
- `loans` - Contains loan application details

## Database Schema

### user_details Collection
```javascript
{
  _id: ObjectId,
  customer_id: "CUS_0x17419",
  name: "Nancy Miller", 
  email: "nancy.miller@example.com",
  phone: "1575692242",
  address: "Pune",
  occupation: "Software Engineer",
  annual_income: 1200000,
  pan_card_number: "ABCDE0000F",
  credit_score: 797,
  credit_category: "Good",
  lending_outlook: "Very likely to be approved for any credit product",
  negative_summary: "No major risk factors identified",
  positive_summary: "Limited positive factors detected", 
  recommendation_tips: "Continue maintaining current financial behavior",
  status: "Approved",
  reviewed_by: "Admin User",
  reviewed_date: ISODate,
  updated_at: ISODate,
  last_updated: null
}
```

### loans Collection
```javascript
{
  _id: ObjectId,
  customer_id: "CUS_0x581aa",
  loan_type: "education-loan",
  loan_data: {
    admissionStatus: "provisional",
    feeStructure: "partial", 
    coApplicant: "spouse",
    courseDuration: 4,
    courseType: "medical",
    employmentProspects: "average"
    // Other loan-specific parameters
  },
  applied_date: ISODate,
  status: "Applied",
  created_at: ISODate,
  updated_at: ISODate
}
```

## Credit Score Requirements

| Loan Type | Minimum Credit Score |
|-----------|---------------------|
| Home Loan | 700 |
| Car Loan | 650 |
| Personal Loan | 600 |
| Education Loan | 580 |
| Business Loan | 750 |

## Eligibility Calculation

**Formula:** `Eligible = applicant_credit_score >= required_credit_score`

- ✅ **Eligible**: Credit score meets or exceeds requirement
- ❌ **Not Eligible**: Credit score below requirement

## API Endpoints

### GET /api/applications
Fetches all loan applications with eligibility calculation

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response:**
```javascript
[
  {
    _id: "loan_id",
    customerId: "CUS_0x17419",
    name: "Nancy Miller",
    email: "nancy.miller@example.com", 
    phone: "1575692242",
    address: "Pune",
    occupation: "Software Engineer",
    annualIncome: 1200000,
    creditScore: 797,
    creditCategory: "Good",
    lendingOutlook: "Very likely to be approved",
    loanType: "education-loan",
    loanData: { /* loan specific parameters */ },
    requiredScore: 580,
    status: "Eligible", // Auto-calculated
    submittedAt: ISODate,
    assignedTo: "Admin User"
  }
]
```

## Frontend Integration

The ApplicationService automatically:
1. Fetches data from the new API endpoint
2. Falls back to mock data if API is unavailable  
3. Displays eligibility status in the UI
4. Updates dashboard statistics

## Running the Application

### Option 1: Manual Start
```powershell
# Terminal 1 - Backend
cd backend; npm start

# Terminal 2 - Frontend  
cd Frontend; npm run dev
```

### Option 2: Automated Start
```powershell
# Run the startup script
.\start-dev.ps1
```

### Option 3: Batch File
```cmd
start-dev.bat
```

## URLs
- **Backend API:** http://localhost:5000
- **Frontend App:** http://localhost:5173
- **Health Check:** http://localhost:5000/health

## Features Implemented

✅ **Database Integration**: Real data from MongoDB collections  
✅ **Eligibility Calculation**: Automatic credit score comparison  
✅ **API Authentication**: JWT token-based security  
✅ **Fallback Support**: Mock data when API unavailable  
✅ **Dashboard Analytics**: Real-time eligible/not eligible counts  
✅ **Static Status Display**: Read-only status cards (no dropdown)  
✅ **Responsive UI**: Clean, modern interface  

## Next Steps

1. Add loan-specific parameter validation
2. Implement application status updates
3. Add email notifications for eligibility changes
4. Create detailed eligibility reports
5. Add export functionality for applications
