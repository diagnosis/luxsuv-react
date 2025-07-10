import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi.jsx';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('luxsuv_user');
      const storedToken = localStorage.getItem('luxsuv_token');
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          
          // Verify token is still valid by fetching user profile
          const profileData = await authApi.getProfile(storedToken);
          
          // Update user data with fresh profile info
          const updatedUser = { ...userData, ...profileData };
          setUser(updatedUser);
          localStorage.setItem('luxsuv_user', JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid session
          setUser(null);
          setToken(null);
          localStorage.removeItem('luxsuv_user');
          localStorage.removeItem('luxsuv_token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const signUp = async (userData) => {
    try {
      const result = await authApi.register(userData);
      
      // Extract user data and token from response
      const newUser = {
        id: result.user?.id || result.id,
        username: userData.username,
        email: userData.email,
        name: userData.username, // Use username as display name for now
        phone: '', // Phone not collected during registration
        role: 'rider', // Always rider for this app
        createdAt: result.user?.created_at || new Date().toISOString(),
      };

      const authToken = result.token;

      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('luxsuv_user', JSON.stringify(newUser));
      localStorage.setItem('luxsuv_token', authToken);
      
      return newUser;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const signIn = async (credentials) => {
    try {
      const result = await authApi.login(credentials);
      
      // Extract user data and token from response
      const userData = {
        id: result.user?.id || result.id,
        email: credentials.email,
        name: result.user?.name || result.name || 'User',
        phone: result.user?.phone || result.phone || '',
        role: result.user?.role || 'rider',
        createdAt: result.user?.created_at || new Date().toISOString(),
      };

      const authToken = result.token;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('luxsuv_user', JSON.stringify(userData));
      localStorage.setItem('luxsuv_token', authToken);
      
      return userData;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('luxsuv_user');
    localStorage.removeItem('luxsuv_token');
  };

  const updatePassword = async (passwordData) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      await authApi.updatePassword(token, passwordData);
      return true;
    } catch (error) {
      console.error('Password update failed:', error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authApi.forgotPassword(email);
      return true;
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  };

  const resetPassword = async (resetData) => {
    try {
      await authApi.resetPassword(resetData);
      return true;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    try {
      const profileData = await authApi.getProfile(token);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('luxsuv_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Profile refresh failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    forgotPassword,
    resetPassword,
    refreshProfile,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};