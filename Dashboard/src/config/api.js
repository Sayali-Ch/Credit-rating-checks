// API Configuration for the Admin Dashboard
// Configure your API settings here

export const API_CONFIG = {
  // Base URL for your backend API
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default headers for all requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Enable/disable mock data fallback during development
  ENABLE_MOCK_FALLBACK: true,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API endpoints configuration
export const ENDPOINTS = {
  USERS: {
    LIST: '/users',
    BY_ID: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    APPLICATIONS: (id) => `/users/${id}/applications`,
  },
  
  APPLICATIONS: {
    LIST: '/applications',
    BY_ID: (id) => `/applications/${id}`,
    CREATE: '/applications',
    UPDATE_STATUS: (id) => `/applications/${id}/status`,
  },
  
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    CREDIT_SCORES: '/analytics/credit-scores',
    LOAN_TYPES: '/analytics/loan-types',
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Request interceptor for adding auth tokens
export const addAuthHeader = (headers = {}) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Response interceptor for handling common errors
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// Generic API request function with retry logic
export const apiRequest = async (url, options = {}, retryCount = 0) => {
  try {
    const headers = addAuthHeader({
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    });

    const response = await fetch(buildApiUrl(url), {
      ...options,
      headers,
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    return await handleApiResponse(response);
  } catch (error) {
    if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return apiRequest(url, options, retryCount + 1);
    }
    throw error;
  }
};
