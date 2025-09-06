// API service for user profile operations
// This will be connected to your MongoDB database

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class UserProfileService {
  // Fetch user profile by customer ID from database
  static async getUserProfile(customerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when implementing auth
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile in database
  static async updateUserProfile(customerId, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when implementing auth
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get all users (for applications table)
  static async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
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
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get user applications by customer ID
  static async getUserApplications(customerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${customerId}/applications`, {
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
      console.error('Error fetching user applications:', error);
      throw error;
    }
  }
}

// Mock data fallback (for development without backend)
// This will be removed when you connect to MongoDB
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
    creditScore: 720
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
    creditScore: 640
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
    creditScore: 690
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
    creditScore: 560
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
    creditScore: 780
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
    creditScore: 620
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
    creditScore: 740
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
    creditScore: 580
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
    creditScore: 710
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
    creditScore: 820
  }
];

// Temporary fallback function for development
export const getUserProfileFallback = (customerId) => {
  return mockUserProfiles.find(user => user.customerId === customerId);
};

export default UserProfileService;
