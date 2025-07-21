import { createContext, useContext, useState, useEffect } from 'react';
import { API_CONFIG, buildApiUrl } from '../api/config';

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
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('luxsuv_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('luxsuv_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (userData) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SIGN_UP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      const result = await response.json();
      const newUser = {
        id: result.user?.id || result.id || Date.now(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        token: result.token,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('luxsuv_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (credentials) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.SIGN_IN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign in failed');
      }

      const result = await response.json();
      const userData = {
        id: result.user?.id || result.id || Date.now(),
        email: credentials.email,
        name: result.user?.username || result.name || 'User',
        phone: result.user?.phone || result.phone || '',
        token: result.token,
        role: result.user?.role || 'rider',
        createdAt: result.user?.created_at || result.createdAt || new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem('luxsuv_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('luxsuv_user');
  };

  const value = {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};