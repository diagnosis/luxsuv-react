import { createContext, useContext, useState, useEffect } from 'react';
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

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('luxsuv_user');
    const storedToken = localStorage.getItem('luxsuv_token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        
        // Verify token is still valid by fetching user profile
        authApi.getProfile(storedToken)
          .then((profileData) => {
            // Update user data with fresh profile info
            const updatedUser = { ...userData, ...profileData };
            setUser(updatedUser);
            localStorage.setItem('luxsuv_user', JSON.stringify(updatedUser));
          })
          .catch((error) => {
            console.error('Token validation failed:', error);
            // Clear invalid session
            setUser(null);
            setToken(null);
            localStorage.removeItem('luxsuv_user');
            localStorage.removeItem('luxsuv_token');
          });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('luxsuv_user');
        localStorage.removeItem('luxsuv_token');
      }
    }
    setIsLoading(false);
  }, []);

  const signUp = async (userData) => {
    try {
      const result = await response.json();
      const newUser = {
        id: result.id || Date.now(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('luxsuv_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      // For demo purposes, create a mock user if API fails
      if (error.message.includes('fetch')) {
        const mockUser = {
          id: Date.now(),
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          createdAt: new Date().toISOString(),
        };
        setUser(mockUser);
        localStorage.setItem('luxsuv_user', JSON.stringify(mockUser));
        return mockUser;
      }
      throw error;
    }
  };

  const signIn = async (credentials) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/signin', {
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
        id: result.id || Date.now(),
        email: credentials.email,
        name: result.name || 'User',
        phone: result.phone || '',
        createdAt: result.createdAt || new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem('luxsuv_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      // For demo purposes, create a mock user if API fails
      if (error.message.includes('fetch')) {
        const mockUser = {
          id: Date.now(),
          email: credentials.email,
          name: 'Demo User',
          phone: '',
          createdAt: new Date().toISOString(),
        };
        setUser(mockUser);
        localStorage.setItem('luxsuv_user', JSON.stringify(mockUser));
        return mockUser;
      }
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