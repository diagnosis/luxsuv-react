import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

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

  const initializeAuth = useCallback(async () => {
    const storedUser = localStorage.getItem('luxsuv_user');
    const storedToken = localStorage.getItem('luxsuv_token');

    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load stored auth:', error);
        localStorage.removeItem('luxsuv_user');
        localStorage.removeItem('luxsuv_token');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const signUp = useCallback(async (userData) => {
    try {
      const registrationData = {
        username: userData.name || userData.username,
        email: userData.email,
        password: userData.password,
        role: 'rider'
      };

      const result = await authApi.register(registrationData);

      const newUser = {
        id: result.user?.id || result.id,
        username: registrationData.username,
        email: userData.email,
        name: registrationData.username,
        phone: '',
        role: 'rider',
        createdAt: result.user?.created_at || new Date().toISOString(),
      };

      const authToken = result.token;

      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('luxsuv_user', JSON.stringify(newUser));
      localStorage.setItem('luxsuv_token', authToken);

      return newUser;
    } catch (error) {
      console.error('Sign up failed:', error.message);
      throw error;
    }
  }, []);

  const signIn = useCallback(async (credentials) => {
    try {
      const result = await authApi.login(credentials);

      const userData = {
        id: result.user?.id || result.id,
        username: result.user?.username || result.username,
        email: credentials.email,
        name: result.user?.username || result.user?.name || result.name || 'User',
        phone: result.user?.phone || result.phone || '',
        role: result.user?.role || 'rider',
        createdAt: result.user?.created_at || new Date().toISOString(),
      };

      const authToken = result.token;

      console.log('✅ Sign in successful - storing token:', {
        hasToken: !!authToken,
        tokenPreview: authToken ? `${authToken.substring(0, 20)}...` : 'No token',
        userData: userData
      });
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('luxsuv_user', JSON.stringify(userData));
      localStorage.setItem('luxsuv_token', authToken);

      return userData;
    } catch (error) {
      console.error('Sign in failed:', error.message);
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('luxsuv_user');
    localStorage.removeItem('luxsuv_token');
  }, []);

  const updatePassword = useCallback(async (passwordData) => {
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
  }, [token]);

  const forgotPassword = useCallback(async (email) => {
    try {
      await authApi.forgotPassword(email);
      return true;
    } catch (error) {
      console.error('Forgot password failed:', error);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (resetData) => {
    try {
      await authApi.resetPassword(resetData);
      return true;
    } catch (error) {
      console.error('Reset password failed:', error);
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
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
  }, [token, user]);

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