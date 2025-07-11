const API_BASE_URL = 'http://localhost:8080';

// Helper function to extract meaningful error messages from API responses
const getErrorMessage = async (response) => {
  try {
    const errorData = await response.json();
    console.log('Backend error response:', errorData); // Debug log
    // Try to get the most specific error message
    return errorData.message || errorData.error || errorData.details || `Request failed with status ${response.status}`;
  } catch (parseError) {
    console.log('Failed to parse error response:', parseError); // Debug log
    // If JSON parsing fails, return status-based message
    switch (response.status) {
      case 400:
        return 'Bad request - please check your input';
      case 401:
        return 'Invalid credentials';
      case 403:
        return 'Access denied';
      case 404:
        return 'Service not found';
      case 500:
        return 'Server error - please try again later';
      default:
        return `Request failed with status ${response.status}`;
    }
  }
};

export const authApi = {
  async register(userData) {
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

    return response.json();
  },

  async login(credentials) {
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

    return response.json();
  },

  async getProfile(token) {
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

    return response.json();
  },

  async updatePassword(token, passwordData) {
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

    return response.json();
  },

  async forgotPassword(email) {
    console.log('Sending forgot password request for:', email); // Debug log
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('Forgot password response status:', response.status); // Debug log

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      console.log('Forgot password error:', errorMessage); // Debug log
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Forgot password success:', result); // Debug log
    return result;
  },

  async resetPassword(resetData) {
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

    return response.json();
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorMessage = await getErrorMessage(response);
      throw new Error(errorMessage);
    }

    return response.json();
  },
};