const API_BASE_URL = 'http://localhost:8080';

export const authApi = {
  // User registration
  register: async (userData) => {
    console.log('🔐 Register API Call:', { email: userData.email, username: userData.username });
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📡 Register Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Register Error Response:', errorData);
      
      const errorMessage = errorData.error || errorData.message || `Registration failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Register Success:', data);
    return data;
  },

  // User login
  login: async (credentials) => {
    console.log('🔐 Login API Call:', { email: credentials.email });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('📡 Login Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Login Error Response:', errorData);
      
      const errorMessage = errorData.error || errorData.message || `Login failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Login Success:', data);
    return data;
  },

  // Get user profile
  getProfile: async (token) => {
    console.log('👤 Profile API Call');
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Profile Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Profile Error Response:', errorData);
      
      const errorMessage = errorData.error || errorData.message || `Profile fetch failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Profile Success:', data);
    return data;
  },

  // Update password
  updatePassword: async (token, passwordData) => {
    console.log('🔒 Update Password API Call');
    
    const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    console.log('📡 Update Password Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Update Password Error Response:', errorData);
      
      const errorMessage = errorData.error || errorData.message || `Password update failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Update Password Success:', data);
    return data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    console.log('📧 Forgot Password API Call:', { email });
    console.log('🌐 Request URL:', `${API_BASE_URL}/auth/forgot-password`);
    console.log('📦 Request Body:', JSON.stringify({ email }));
    
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('📡 Forgot Password Response Status:', response.status);
    console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse response as JSON:', e);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ Forgot Password Error Response:', data);
      const errorMessage = data.error || data.message || `Forgot password failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Forgot Password Success:', data);
    return data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    console.log('🔄 Reset Password API Call');
    console.log('📦 Request Body:', JSON.stringify({
      reset_token: resetData.token,
      new_password: resetData.newPassword
    }));
    
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reset_token: resetData.token,
        new_password: resetData.newPassword
      }),
    });

    console.log('📡 Reset Password Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Reset Password Error Response:', errorData);
      
      const errorMessage = errorData.error || errorData.message || `Password reset failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Reset Password Success:', data);
    return data;
  },

  // Health check
  healthCheck: async () => {
    console.log('🏥 Health Check API Call');
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    console.log('📡 Health Check Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Health Check Error Response:', errorData);
      
      const errorMessage = errorData.error || errorData.message || `Health check failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('✅ Health Check Success:', data);
    return data;
  },
};