// API service for applications operations
// This will be connected to your MongoDB database

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApplicationService {
  // Fetch all applications from database
  static async getAllApplications() {
    try {
      console.log('🔗 Making API request to:', `${API_BASE_URL}/applications`);
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when implementing auth
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
      });

      console.log('🌐 API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Response data length:', data.length);
      console.log('📊 First record:', data[0]);
      return data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
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
}

// Mock data fallback (for development without backend)
const mockApplications = [
  { id: 1, name: "Alice Williams", creditScore: 720, loanType: "Home Loan", requiredScore: 700, status: "Approved", appliedDate: "2024-09-01", amount: "$450,000" },
  { id: 2, name: "Liam Smith", creditScore: 640, loanType: "Car Loan", requiredScore: 650, status: "Rejected", appliedDate: "2024-09-02", amount: "$35,000" },
  { id: 3, name: "Emma Johnson", creditScore: 690, loanType: "Personal Loan", requiredScore: 680, status: "Approved", appliedDate: "2024-09-02", amount: "$25,000" },
  { id: 4, name: "Noah Brown", creditScore: 560, loanType: "Education Loan", requiredScore: 600, status: "Rejected", appliedDate: "2024-09-01", amount: "$75,000" },
  { id: 5, name: "Olivia Davis", creditScore: 780, loanType: "Home Loan", requiredScore: 700, status: "Approved", appliedDate: "2024-08-30", amount: "$620,000" },
  { id: 6, name: "William Wilson", creditScore: 620, loanType: "Personal Loan", requiredScore: 650, status: "Under Scrutiny", appliedDate: "2024-09-03", amount: "$18,000" },
  { id: 7, name: "Sophia Moore", creditScore: 740, loanType: "Car Loan", requiredScore: 700, status: "Approved", appliedDate: "2024-08-29", amount: "$42,000" },
  { id: 8, name: "James Taylor", creditScore: 580, loanType: "Education Loan", requiredScore: 600, status: "Under Scrutiny", appliedDate: "2024-08-28", amount: "$85,000" },
  { id: 9, name: "Isabella Anderson", creditScore: 710, loanType: "Home Loan", requiredScore: 700, status: "Approved", appliedDate: "2024-08-27", amount: "$380,000" },
  { id: 10, name: "Benjamin Thomas", creditScore: 820, loanType: "Business Loan", requiredScore: 750, status: "Under Scrutiny", appliedDate: "2024-08-26", amount: "$150,000" }
];

// Temporary fallback function for development
export const getApplicationsFallback = () => {
  return mockApplications;
};

export default ApplicationService;
