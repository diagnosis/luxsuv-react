const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper function to extract meaningful error messages from API responses
const getErrorMessage = async (response) => {
  try {
    const errorData = await response.json();
    // Try to get the most specific error message
    return errorData.message || errorData.error || errorData.details || `Request failed with status ${response.status}`;
  } catch (parseError) {
    // If JSON parsing fails, return status-based message
    switch (response.status) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Invalid email or password';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 409:
        return 'Resource already exists';
      case 422:
        return 'Validation failed';
      case 500:
        return 'Server error occurred';
      default:
        return `Request failed with status ${response.status}`;
    }
  }
};

export const authApi = {
  // Health check endpoint
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Get user profile
  async getProfile(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  },

  // Update password
  async updatePassword(token, passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  },

  // Forgot password - request reset token
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  },

  // Reset password with token
  async resetPassword(resetData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (!response.ok) {
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  },
};