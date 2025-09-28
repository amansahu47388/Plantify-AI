// API Configuration
import { getAPIBaseURL, initializeAPIConfig } from '../config/api';
import { handleApiError, retryRequest, checkNetworkConnectivity, logError } from './errorHandler';

// AsyncStorage import with error handling
let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.warn('AsyncStorage not available, using mock storage');
  AsyncStorage = {
    setItem: async (key, value) => {
      console.log('Mock AsyncStorage setItem:', key, value);
      return Promise.resolve();
    },
    getItem: async (key) => {
      console.log('Mock AsyncStorage getItem:', key);
      return Promise.resolve(null);
    },
    removeItem: async (key) => {
      console.log('Mock AsyncStorage removeItem:', key);
      return Promise.resolve();
    },
    clear: async () => {
      console.log('Mock AsyncStorage clear');
      return Promise.resolve();
    }
  };
}

// Function to get API endpoints with current base URL
export const getAPIEndpoints = () => {
  const baseURL = getAPIBaseURL();
  const cropDiseaseBaseURL = baseURL.replace('/account', '/crop-disease');
  return {
    REGISTER: `${baseURL}/register/`,
    LOGIN: `${baseURL}/login/`,
    VERIFY_OTP: `${baseURL}/verify-otp/`,
    RESEND_OTP: `${baseURL}/resend-otp/`,
    PROFILE: `${baseURL}/profile/`,
    PASSWORD_RESET_REQUEST: `${baseURL}/password-reset/request/`,
    PASSWORD_RESET_VERIFY: `${baseURL}/password-reset/verify/`,
    PASSWORD_RESET_CONFIRM: `${baseURL}/password-reset/confirm/`,
    CHANGE_PASSWORD: `${baseURL}/change-password/`,
    CHECK_PASSWORD_STRENGTH: `${baseURL}/check-password-strength/`,
    CROP_DISEASE_PREDICT: `${cropDiseaseBaseURL}/predict/`,
  };
};

// API endpoints (will be updated dynamically)
export let API_ENDPOINTS = getAPIEndpoints();

// Function to update API endpoints when IP changes
export const updateAPIEndpoints = () => {
  API_ENDPOINTS = getAPIEndpoints();
  console.log('🔄 API endpoints updated:', API_ENDPOINTS);
};

// Token management
export const TokenManager = {
  // Store tokens in AsyncStorage
  setTokens: async (accessToken, refreshToken) => {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      logError(error, 'TokenManager.setTokens');
      throw new Error('Failed to store authentication tokens. Please try again.');
    }
  },

  // Get access token
  getAccessToken: async () => {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      logError(error, 'TokenManager.getAccessToken');
      return null;
    }
  },

  // Get refresh token
  getRefreshToken: async () => {
    try {
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      logError(error, 'TokenManager.getRefreshToken');
      return null;
    }
  },

  // Clear all tokens
  clearTokens: async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
    } catch (error) {
      logError(error, 'TokenManager.clearTokens');
      // Don't throw error for clearing tokens as it's not critical
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await TokenManager.getAccessToken();
    return token !== null;
  }
};

// API request helper with comprehensive error handling
export const apiRequest = async (endpoint, options = {}) => {
  // Check network connectivity first
  const isConnected = await checkNetworkConnectivity();
  if (!isConnected) {
    throw new Error('No internet connection. Please check your network settings.');
  }

  const defaultOptions = {
    headers: {},
    timeout: 30000, // 30 second timeout
  };

  // Add authorization header if token exists
  const token = await TokenManager.getAccessToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // Debug logging
  console.log('Making API request to:', endpoint);
  console.log('Request config:', config);

  try {
    const response = await fetch(endpoint, config);
    
    // Check if response is ok
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData = null;
      
      try {
        errorData = await response.json();
        console.log('📝 API Error Response:', errorData);
        
        // Extract specific error message
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0];
        } else if (typeof errorData === 'object') {
          // Handle field-specific errors
          const fieldErrors = Object.values(errorData).flat();
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors[0];
          }
        }
      } catch (e) {
        // If we can't parse JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // Add context to error message
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = errorData;
      throw error;
    }

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid JSON response from server');
    }

    return data;
  } catch (error) {
    logError(error, 'apiRequest', { endpoint, options });
    
    // Handle specific error types
    if (error.message === 'Network request failed' || error.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check:\n1. Backend server is running\n2. IP address is correct\n3. Both devices are on same network');
    } else if (error.message.includes('timeout') || error.message.includes('Request timeout')) {
      throw new Error('Request timeout. Please check your network connection.');
    } else if (error.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    } else if (error.status === 404) {
      throw new Error('Requested resource not found. Please check your request.');
    } else if (error.status === 422) {
      throw new Error('Invalid input. Please check your data and try again.');
    } else if (error.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw error;
    }
  }
};

// Refresh token helper with error handling
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available. Please log in again.');
    }

    const response = await fetch(`${getAPIBaseURL()}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Refresh token expired. Please log in again.');
      }
      throw new Error('Failed to refresh token. Please log in again.');
    }

    const data = await response.json();
    await TokenManager.setTokens(data.access, refreshToken);
    return data.access;
  } catch (error) {
    logError(error, 'refreshAccessToken');
    await TokenManager.clearTokens();
    throw new Error('Session expired. Please log in again.');
  }
};