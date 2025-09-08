// API service for analytics operations
// This will be connected to your MongoDB database
import AuthService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Temporary fallback function for development
export const getAnalyticsFallback = () => {
  return mockAnalyticsData;
};

class AnalyticsService {
  // Fetch analytics dashboard data
  static async getDashboardAnalytics() {
    try {
      // Try to fetch credit score distribution from real database
      console.log('🔄 Attempting to fetch real analytics data...');
      
      const creditScoreResponse = await fetch(`${API_BASE_URL}/api/analytics/credit-score-distribution`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
      });

      if (!creditScoreResponse.ok) {
        console.warn('❌ Analytics API failed, using fallback data');
        throw new Error(`HTTP error! status: ${creditScoreResponse.status}`);
      }

      const creditScoreData = await creditScoreResponse.json();
      console.log('✅ Real analytics data fetched:', creditScoreData);
      
      // Return dashboard data with real credit score distribution
      return {
        totalUsers: creditScoreData.totalUsers,
        totalApplications: 10, // You can add another endpoint for this
        avgCreditScore: 680, // You can calculate this from the real data
        approvalRate: 50, // You can add another endpoint for this
        creditScoreDistribution: creditScoreData.distribution,
        loanTypeBreakdown: [
          { name: "Home Loan", value: 35, color: "#198ae6" },
          { name: "Car Loan", value: 25, color: "#3b82f6" },
          { name: "Personal Loan", value: 20, color: "#6366f1" },
          { name: "Education Loan", value: 15, color: "#8b5cf6" },
          { name: "Business Loan", value: 5, color: "#a855f7" }
        ]
      };
    } catch (error) {
      console.error('Error fetching analytics, using fallback:', error);
      // Return fallback data when API fails
      return getAnalyticsFallback();
    }
  }

  // Helper method to get auth token
  static getAuthToken() {
    // Get token from cookies or sessionStorage
    return document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] || 
           sessionStorage.getItem('authToken') || '';
  }

  // Fetch credit score distribution
  static async getCreditScoreDistribution() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analytics/credit-score-distribution`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AuthService.getToken()}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.distribution;
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
  totalUsers: 50,
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

export default AnalyticsService;
