// Updated API base URL to match your backend
const API_BASE_URL = 'http://localhost:8080';

export const authApi = {
  // User registration
  register: async (userData) => {
    console.log('🔐 Register API Call:', { 
      username: userData.username,
      email: userData.email, 
      role: userData.role || 'rider'
    });
    
    const requestBody = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'rider'
    };
    
    console.log('📦 Register Request Body:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Register Response Status:', response.status);
    console.log('📋 Register Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Register Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse register response as JSON:', e);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ Register Error Response:', data);
      const errorMessage = data.error || data.message || `Registration failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Register Success:', data);
    return data;
  },

  // User login
  login: async (credentials) => {
    console.log('🔐 Login API Call:', { email: credentials.email });
    
    const requestBody = {
      email: credentials.email,
      password: credentials.password
    };
    
    console.log('📦 Login Request Body:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Login Response Status:', response.status);
    console.log('📋 Login Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Login Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse login response as JSON:', e);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ Login Error Response:', data);
      const errorMessage = data.error || data.message || `Login failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Login Success:', data);
    return data;
  },

  // Get user profile
  getProfile: async (token) => {
    console.log('👤 Profile API Call');
    console.log('🔑 Using Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token) {
      throw new Error('No authentication token provided');
    }
    
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Profile Response Status:', response.status);
    console.log('📋 Profile Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Profile Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse profile response as JSON:', e);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ Profile Error Response:', data);
      const errorMessage = data.error || data.message || `Profile fetch failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Profile Success:', data);
    return data;
  },

  // Update password
  updatePassword: async (token, passwordData) => {
    console.log('🔒 Update Password API Call');
    console.log('🔑 Using Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token) {
      throw new Error('No authentication token provided');
    }
    
    const requestBody = {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword
    };
    
    console.log('📦 Update Password Request Body:', { 
      current_password: '[HIDDEN]', 
      new_password: '[HIDDEN]' 
    });
    
    const response = await fetch(`${API_BASE_URL}/users/me/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Update Password Response Status:', response.status);
    console.log('📋 Update Password Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Update Password Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse update password response as JSON:', e);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ Update Password Error Response:', data);
      const errorMessage = data.error || data.message || `Password update failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Update Password Success:', data);
    return data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    console.log('📧 Forgot Password API Call:', { email });
    
    const requestBody = { email };
    console.log('📦 Forgot Password Request Body:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Forgot Password Response Status:', response.status);
    console.log('📋 Forgot Password Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Forgot Password Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse forgot password response as JSON:', e);
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
    
    const requestBody = {
      reset_token: resetData.token,
      new_password: resetData.newPassword
    };
    
    console.log('📦 Reset Password Request Body:', {
      reset_token: resetData.token ? `${resetData.token.substring(0, 20)}...` : 'No token',
      new_password: '[HIDDEN]'
    });
    
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Reset Password Response Status:', response.status);
    console.log('📋 Reset Password Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Reset Password Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse reset password response as JSON:', e);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ Reset Password Error Response:', data);
      const errorMessage = data.error || data.message || `Password reset failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Reset Password Success:', data);
    return data;
  },

  // Health check
  healthCheck: async () => {
    console.log('🏥 Health Check API Call');
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Health Check Response Status:', response.status);
    console.log('📋 Health Check Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Health Check Raw Response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse health check response as JSON:', e);
      throw new Error(`Invalid response format: ${responseText}`);
    }
    
    if (!response.ok) {
      console.error('❌ Health Check Error Response:', data);
      const errorMessage = data.error || data.message || `Health check failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log('✅ Health Check Success:', data);
    return data;
  },
};