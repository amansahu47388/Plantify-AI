import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const hasToken = await AuthService.isAuthenticated();
      
      if (hasToken) {
        // Try to get user profile to verify token is still valid
        const profileResult = await AuthService.getProfile();
        if (profileResult.success) {
          setUser(profileResult.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear it
          await AuthService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        // Get user profile after successful login
        const profileResult = await AuthService.getProfile();
        if (profileResult.success) {
          setUser(profileResult.data);
          setIsAuthenticated(true);
          return { success: true, data: result.data };
        } else {
          // Login successful but profile fetch failed
          setUser({ email: result.data.email, first_name: result.data.first_name, last_name: result.data.last_name });
          setIsAuthenticated(true);
          return { success: true, data: result.data };
        }
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const result = await AuthService.register(userData);
      
      if (result.success) {
        // After successful registration, user needs to verify email
        // Don't set as authenticated yet
        return result;
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setIsLoading(true);
      const result = await AuthService.verifyOTP(email, otp);
      
      if (result.success) {
        // Get user profile after successful verification
        const profileResult = await AuthService.getProfile();
        if (profileResult.success) {
          setUser(profileResult.data);
          setIsAuthenticated(true);
        } else {
          // Verification successful but profile fetch failed
          setUser({ email: result.data.email });
          setIsAuthenticated(true);
        }
        return result;
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const result = await AuthService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      setTokens(null);
      
      return result;
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
      setIsAuthenticated(false);
      setTokens(null);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      const result = await AuthService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.data);
        return result;
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const result = await AuthService.getProfile();
      if (result.success) {
        setUser(result.data);
        return result;
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    tokens,
    login,
    register,
    verifyOTP,
    logout,
    updateProfile,
    refreshProfile,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
