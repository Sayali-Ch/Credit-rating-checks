// User Profile Service - API calls for user's own profile management
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class UserProfileService {
  // Get user's own profile
  static async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('User Profile Service Error:', error);
      throw error;
    }
  }

  // Update user's own profile
  static async updateUserProfile(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('User Update Profile Error:', error);
      throw error;
    }
  }

  // Get user's applications
  static async getUserApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/user/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('User Applications Error:', error);
      throw error;
    }
  }

  // Submit new loan application
  static async submitApplication(applicationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Submit Application Error:', error);
      throw error;
    }
  }
}

// Mock data fallback (for development without backend)
// This represents what a user sees about their own profile
const mockUserProfiles = [
  {
    customerId: "1",
    name: "Alice Williams",
    email: "alice.williams@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    occupation: "Software Engineer",
    pancardNumber: "BXER4568VD",
    annualIncome: "$95,000",
    creditScore: 720,
    accountType: "Premium",
    memberSince: "January 2023",
    lastUpdated: "2024-09-01"
  },
  {
    customerId: "2",
    name: "Liam Smith",
    email: "liam.smith@email.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Somewhere, ST 23456",
    occupation: "Marketing Manager",
    pancardNumber: "CXER5679WE",
    annualIncome: "$72,000",
    creditScore: 640,
    accountType: "Standard",
    memberSince: "February 2023",
    lastUpdated: "2024-08-30"
  },
  {
    customerId: "3",
    name: "Emma Johnson",
    email: "emma.johnson@email.com",
    phone: "+1 (555) 345-6789",
    address: "789 Pine Rd, Elsewhere, ST 34567",
    occupation: "Data Analyst",
    pancardNumber: "DXER6780XF",
    annualIncome: "$68,000",
    creditScore: 690,
    accountType: "Standard",
    memberSince: "March 2023",
    lastUpdated: "2024-08-28"
  },
  {
    customerId: "4",
    name: "Noah Brown",
    email: "noah.brown@email.com",
    phone: "+1 (555) 456-7890",
    address: "321 Elm St, Nowhere, ST 45678",
    occupation: "Teacher",
    pancardNumber: "EXER7891YG",
    annualIncome: "$45,000",
    creditScore: 560,
    accountType: "Basic",
    memberSince: "April 2023",
    lastUpdated: "2024-08-25"
  },
  {
    customerId: "5",
    name: "Olivia Davis",
    email: "olivia.davis@email.com",
    phone: "+1 (555) 567-8901",
    address: "654 Maple Dr, Anywhere, ST 56789",
    occupation: "Financial Advisor",
    pancardNumber: "FXER8902ZH",
    annualIncome: "$125,000",
    creditScore: 780,
    accountType: "Premium",
    memberSince: "May 2023",
    lastUpdated: "2024-09-02"
  },
  {
    customerId: "6",
    name: "William Wilson",
    email: "william.wilson@email.com",
    phone: "+1 (555) 678-9012",
    address: "987 Cedar Ln, Somewhere, ST 67890",
    occupation: "Sales Representative",
    pancardNumber: "GXER9013AI",
    annualIncome: "$58,000",
    creditScore: 620,
    accountType: "Standard",
    memberSince: "June 2023",
    lastUpdated: "2024-08-26"
  },
  {
    customerId: "7",
    name: "Sophia Moore",
    email: "sophia.moore@email.com",
    phone: "+1 (555) 789-0123",
    address: "147 Birch Ave, Elsewhere, ST 78901",
    occupation: "Project Manager",
    pancardNumber: "HXER0124BJ",
    annualIncome: "$85,000",
    creditScore: 740,
    accountType: "Premium",
    memberSince: "July 2023",
    lastUpdated: "2024-09-03"
  },
  {
    customerId: "8",
    name: "James Taylor",
    email: "james.taylor@email.com",
    phone: "+1 (555) 890-1234",
    address: "258 Spruce St, Nowhere, ST 89012",
    occupation: "Student",
    pancardNumber: "IXER1235CK",
    annualIncome: "$25,000",
    creditScore: 580,
    accountType: "Basic",
    memberSince: "August 2023",
    lastUpdated: "2024-08-20"
  },
  {
    customerId: "9",
    name: "Isabella Anderson",
    email: "isabella.anderson@email.com",
    phone: "+1 (555) 901-2345",
    address: "369 Willow Rd, Anywhere, ST 90123",
    occupation: "Nurse",
    pancardNumber: "JXER2346DL",
    annualIncome: "$65,000",
    creditScore: 710,
    accountType: "Standard",
    memberSince: "September 2023",
    lastUpdated: "2024-08-31"
  },
  {
    customerId: "10",
    name: "Benjamin Thomas",
    email: "benjamin.thomas@email.com",
    phone: "+1 (555) 012-3456",
    address: "741 Poplar Dr, Somewhere, ST 01234",
    occupation: "Business Owner",
    pancardNumber: "KXER3457EM",
    annualIncome: "$150,000",
    creditScore: 820,
    accountType: "VIP",
    memberSince: "October 2023",
    lastUpdated: "2024-09-04"
  }
];

// Temporary fallback function for development (user version)
export const getUserProfileFallback = (customerId) => {
  return mockUserProfiles.find(user => user.customerId === customerId);
};

export default UserProfileService;
