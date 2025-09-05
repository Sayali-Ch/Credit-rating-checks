// API service for analytics operations
// This will be connected to your MongoDB database

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AnalyticsService {
  // Fetch analytics dashboard data
  static async getDashboardAnalytics() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
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
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Fetch credit score distribution
  static async getCreditScoreDistribution() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/credit-scores`, {
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
      console.error('Error fetching credit score distribution:', error);
      throw error;
    }
  }

  // Fetch loan type breakdown
  static async getLoanTypeBreakdown() {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/loan-types`, {
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
      console.error('Error fetching loan type breakdown:', error);
      throw error;
    }
  }
}

// Mock data fallback (for development without backend)
const mockAnalyticsData = {
  totalUsers: 10,
  totalApplications: 10,
  avgCreditScore: 680,
  approvalRate: 50,
  creditScoreDistribution: [
    { range: "Fair (550-649)", count: 3, color: "#f59e0b" },
    { range: "Good (650-749)", count: 4, color: "#22c55e" },
    { range: "Excellent (750-900)", count: 3, color: "#16a34a" }
  ],
  loanTypeBreakdown: [
    { name: "Home Loan", value: 35, color: "#198ae6" },
    { name: "Car Loan", value: 25, color: "#3b82f6" },
    { name: "Personal Loan", value: 20, color: "#6366f1" },
    { name: "Education Loan", value: 15, color: "#8b5cf6" },
    { name: "Business Loan", value: 5, color: "#a855f7" }
  ]
};

// Temporary fallback function for development
export const getAnalyticsFallback = () => {
  return mockAnalyticsData;
};

export default AnalyticsService;
