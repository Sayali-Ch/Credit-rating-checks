// API service for applications operations
// This will be connected to your MongoDB database
import AuthService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApplicationService {
  // Loan type credit score requirements
  static loanRequirements = {
    'Home Loan': 700,
    'Car Loan': 650,
    'Personal Loan': 600,
    'Education Loan': 580,
    'Business Loan': 750
  };

  // Calculate eligibility based on credit score vs required score
  static calculateEligibility(application) {
    const requiredScore = this.loanRequirements[application.loanType] || 650;
    const isEligible = application.creditScore >= requiredScore;
    
    return {
      ...application,
      requiredScore,
      status: isEligible ? 'Eligible' : 'Not Eligible'
    };
  }

  // Fetch all applications from database
  static async getAllApplications() {
    try {
      console.log('🔗 Making API request to:', `${API_BASE_URL}/applications`);
      console.log('🔑 Token available:', !!localStorage.getItem('token'));
      
      // Try with auth first, then fallback to test endpoint
      let response;
      const token = localStorage.getItem('token');
      
      if (token) {
        response = await fetch(`${API_BASE_URL}/applications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } else {
        console.log('🔄 No token found, trying test endpoint...');
        response = await fetch(`${API_BASE_URL}/test-applications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
      }

      console.log('🌐 API Response status:', response.status);
      console.log('🌐 API Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('📊 API Response data length:', data.length);
      console.log('📊 First record:', data[0]);
      
      // Data already includes eligibility calculation from backend
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      // Fallback to mock data if API fails
      console.warn('🔄 Using fallback mock data due to API error');
      return this.getApplicationsFallback();
    }
  }

  // Update application status in database
  static async updateApplicationStatus(applicationId, newStatus) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when implementing auth
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Create new application
  static async createApplication(applicationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  // Get application by ID
  static async getApplicationById(applicationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  // Submit customer loan application
  static async submitLoanApplication(applicationData) {
    try {
      console.log('🔗 Submitting loan application:', applicationData);
      
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/customer-applications`, {
        method: 'POST',
        body: JSON.stringify({ loanType: applicationData.loanType }),
      });

      console.log('🌐 Application submission response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Application submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error submitting application:', error);
      throw error;
    }
  }

  // Get customer applications from JWT token
  static async getMyApplications() {
    try {
      console.log('🔗 Fetching my applications...');
      
      const response = await AuthService.authenticatedFetch(`${API_BASE_URL}/customer-applications/my-applications`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 My applications:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching my applications:', error);
      throw error;
    }
  }

  // Fallback method for mock data
  static getApplicationsFallback() {
    return mockApplications.map(app => this.calculateEligibility(app));
  }
}

// Mock data fallback (for development without backend)
const mockApplications = [
  { 
    _id: '1', 
    customerId: 'CUST001', 
    name: 'Alice Williams', 
    loanAmount: 450000,
    creditScore: 720,
    loanType: 'Home Loan',
    submittedAt: '2024-09-01T10:30:00Z',
    assignedTo: 'Agent Smith',
    documents: ['id-proof.pdf', 'income-certificate.pdf']
  },
  { 
    _id: '2', 
    customerId: 'CUST002', 
    name: 'Liam Smith', 
    loanAmount: 35000,
    creditScore: 640,
    loanType: 'Car Loan',
    submittedAt: '2024-09-02T14:20:00Z',
    assignedTo: 'Agent Johnson',
    documents: ['id-proof.pdf', 'bank-statement.pdf']
  },
  { 
    _id: '3', 
    customerId: 'CUST003', 
    name: 'Emma Johnson', 
    loanAmount: 25000,
    creditScore: 690,
    loanType: 'Personal Loan',
    submittedAt: '2024-09-02T09:15:00Z',
    assignedTo: 'Agent Brown',
    documents: ['id-proof.pdf']
  },
  { 
    _id: '4', 
    customerId: 'CUST004', 
    name: 'Noah Brown', 
    loanAmount: 75000,
    creditScore: 560,
    loanType: 'Education Loan',
    submittedAt: '2024-09-01T11:45:00Z',
    assignedTo: 'Agent Davis',
    documents: ['id-proof.pdf', 'income-certificate.pdf', 'property-papers.pdf']
  },
  { 
    _id: '5', 
    customerId: 'CUST005', 
    name: 'Olivia Davis', 
    loanAmount: 620000,
    creditScore: 780,
    loanType: 'Home Loan',
    submittedAt: '2024-08-30T16:30:00Z',
    assignedTo: 'Agent Wilson',
    documents: ['id-proof.pdf', 'salary-slip.pdf']
  },
  { 
    _id: '6', 
    customerId: 'CUST006', 
    name: 'William Wilson', 
    loanAmount: 18000,
    creditScore: 620,
    loanType: 'Personal Loan',
    submittedAt: '2024-09-03T08:15:00Z',
    assignedTo: 'Agent Garcia',
    documents: ['id-proof.pdf', 'employment-letter.pdf']
  },
  { 
    _id: '7', 
    customerId: 'CUST007', 
    name: 'Sophia Moore', 
    loanAmount: 42000,
    creditScore: 740,
    loanType: 'Car Loan',
    submittedAt: '2024-08-29T13:20:00Z',
    assignedTo: 'Agent Martinez',
    documents: ['id-proof.pdf', 'vehicle-quote.pdf']
  },
  { 
    _id: '8', 
    customerId: 'CUST008', 
    name: 'James Taylor', 
    loanAmount: 85000,
    creditScore: 580,
    loanType: 'Education Loan',
    submittedAt: '2024-08-28T15:45:00Z',
    assignedTo: 'Agent Rodriguez',
    documents: ['id-proof.pdf', 'admission-letter.pdf']
  },
  { 
    _id: '9', 
    customerId: 'CUST009', 
    name: 'Isabella Anderson', 
    loanAmount: 380000,
    creditScore: 710,
    loanType: 'Home Loan',
    submittedAt: '2024-08-27T12:10:00Z',
    assignedTo: 'Agent Lee',
    documents: ['id-proof.pdf', 'property-valuation.pdf']
  },
  { 
    _id: '10', 
    customerId: 'CUST010', 
    name: 'Benjamin Thomas', 
    loanAmount: 150000,
    creditScore: 820,
    loanType: 'Business Loan',
    submittedAt: '2024-08-26T09:30:00Z',
    assignedTo: 'Agent Kim',
    documents: ['id-proof.pdf', 'business-plan.pdf', 'financial-statements.pdf']
  }
];

// Temporary fallback function for development
export const getApplicationsFallback = () => {
  // Apply eligibility calculation to mock data
  return mockApplications.map(app => ApplicationService.calculateEligibility(app));
};

export default ApplicationService;
