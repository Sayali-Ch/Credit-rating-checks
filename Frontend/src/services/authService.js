// Authentication service for handling JWT tokens with cookies
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class AuthService {
  // Store token in secure HTTP-only cookie (fallback to regular cookie)
  static setToken(token) {
    // Store in secure cookie with 24-hour expiration
    Cookies.set('authToken', token, { 
      expires: 1, // 1 day
      secure: window.location.protocol === 'https:', // Only over HTTPS in production
      sameSite: 'strict', // CSRF protection
      path: '/' 
    });
    
    // Also store in sessionStorage as backup
    sessionStorage.setItem('authToken', token);
  }

  // Get token from cookies with fallback to sessionStorage
  static getToken() {
    let token = Cookies.get('authToken');
    if (!token) {
      token = sessionStorage.getItem('authToken');
      // If found in sessionStorage, restore to cookie
      if (token) {
        this.setToken(token);
      }
    }
    return token;
  }

  // Remove token from both cookies and sessionStorage
  static removeToken() {
    Cookies.remove('authToken', { path: '/' });
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('userData'); // Clean up legacy data
    localStorage.removeItem('adminData');
  }

  // Store user data in secure cookie
  static setUserData(userData) {
    Cookies.set('userData', JSON.stringify(userData), {
      expires: 1,
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
      path: '/'
    });
  }

  // Get user data from cookie
  static getUserData() {
    try {
      const userData = Cookies.get('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from cookie:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  // Get user info from token
  static getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        customerId: payload.customerId,
        email: payload.email,
        name: payload.name,
        role: payload.role
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  // Login with credentials
  static async login(email, password, isAdmin = false) {
    try {
      const endpoint = isAdmin ? '/admin-login' : '/login';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token and user data in cookies
        this.setToken(data.token);
        this.setUserData(data.user || data.admin);
        
        return {
          success: true,
          user: data.user || data.admin,
          token: data.token,
          role: data.role || 'customer'
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  // Logout and clear all stored data
  static logout() {
    this.removeToken();
    // Clear any other stored data
    Cookies.remove('userData', { path: '/' });
    sessionStorage.clear();
  }

  // Validate token with server
  static async validateToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/api/validate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Get authenticated headers for API calls
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Enhanced fetch with automatic token handling
  static async authenticatedFetch(url, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Add auth headers to the request
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, authOptions);
      
      // If token is expired or invalid
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token
        this.logout();
        // Redirect to login
        window.location.href = '/login';
        throw new Error('Authentication failed. Please login again.');
      }
      
      return response;
    } catch (error) {
      if (error.message.includes('Authentication failed')) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Initialize auth state from cookies on app start
  static initializeAuth() {
    const token = this.getToken();
    const userData = this.getUserData();
    
    if (token && userData) {
      // Validate token in background
      this.validateToken().then(isValid => {
        if (!isValid) {
          console.log('Token validation failed, clearing auth state');
          this.logout();
        }
      });
      
      return { token, userData };
    }
    
    return null;
  }

  // Auto-refresh mechanism (can be called periodically)
  static async refreshAuthState() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const isValid = await this.validateToken();
      if (!isValid) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Auth refresh error:', error);
      this.logout();
      return false;
    }
  }

  // Get user profile from server
  static async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}

export default AuthService;
