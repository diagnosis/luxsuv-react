const API_BASE_URL = 'http://localhost:8080';

export const authApi = {
  // Register a new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed: ${response.status}`);
    }

    return response.json();
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    return response.json();
  },

  // Get current user profile
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get profile: ${response.status}`);
    }

    return response.json();
  },

  // Update user password
  updatePassword: async (token, passwordData) => {
    const response = await fetch(`${API_BASE_URL}/users/me/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Password update failed: ${response.status}`);
    }

    return response.json();
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Password reset request failed: ${response.status}`);
    }

    return response.json();
  },

  // Reset password with token
  resetPassword: async (resetData) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: resetData.token,
        new_password: resetData.newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Password reset failed: ${response.status}`);
    }

    return response.json();
  },

  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    return response.json();
  },
};