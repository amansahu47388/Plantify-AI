import { Alert } from 'react-native';

// Error types and their corresponding user-friendly messages
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  EMAIL_VERIFICATION_ERROR: 'EMAIL_VERIFICATION_ERROR',
  PASSWORD_RESET_ERROR: 'PASSWORD_RESET_ERROR',
  PROFILE_UPDATE_ERROR: 'PROFILE_UPDATE_ERROR',
  IMAGE_UPLOAD_ERROR: 'IMAGE_UPLOAD_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
};

// Error messages for different scenarios
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check:\n\n• Your internet connection\n• Backend server is running\n• IP address is correct\n• Both devices are on same network',
    action: 'Try Again'
  },
  [ERROR_TYPES.AUTHENTICATION_ERROR]: {
    title: 'Authentication Failed',
    message: 'Invalid email or password. Please check your credentials and try again.',
    action: 'OK'
  },
  [ERROR_TYPES.VALIDATION_ERROR]: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    action: 'OK'
  },
  [ERROR_TYPES.SERVER_ERROR]: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
    action: 'OK'
  },
  [ERROR_TYPES.TIMEOUT_ERROR]: {
    title: 'Request Timeout',
    message: 'The request is taking too long. Please check your connection and try again.',
    action: 'Try Again'
  },
  [ERROR_TYPES.TOKEN_EXPIRED]: {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    action: 'Login'
  },
  [ERROR_TYPES.EMAIL_VERIFICATION_ERROR]: {
    title: 'Email Verification Failed',
    message: 'Unable to verify your email. Please check the verification code and try again.',
    action: 'OK'
  },
  [ERROR_TYPES.PASSWORD_RESET_ERROR]: {
    title: 'Password Reset Failed',
    message: 'Unable to reset your password. Please try again or request a new reset link.',
    action: 'OK'
  },
  [ERROR_TYPES.PROFILE_UPDATE_ERROR]: {
    title: 'Profile Update Failed',
    message: 'Unable to update your profile. Please check your information and try again.',
    action: 'OK'
  },
  [ERROR_TYPES.IMAGE_UPLOAD_ERROR]: {
    title: 'Image Upload Failed',
    message: 'Unable to upload your image. Please check the file size and format, then try again.',
    action: 'OK'
  },
  [ERROR_TYPES.PERMISSION_ERROR]: {
    title: 'Permission Denied',
    message: 'This app needs permission to access your camera/gallery. Please enable it in settings.',
    action: 'Settings'
  },
  [ERROR_TYPES.STORAGE_ERROR]: {
    title: 'Storage Error',
    message: 'Unable to save data locally. Please check your device storage.',
    action: 'OK'
  },
  [ERROR_TYPES.UNKNOWN_ERROR]: {
    title: 'Unexpected Error',
    message: 'Something unexpected happened. Please try again.',
    action: 'OK'
  }
};

// HTTP status code mappings
export const HTTP_STATUS_CODES = {
  400: ERROR_TYPES.VALIDATION_ERROR,
  401: ERROR_TYPES.AUTHENTICATION_ERROR,
  403: ERROR_TYPES.AUTHENTICATION_ERROR,
  404: ERROR_TYPES.SERVER_ERROR,
  408: ERROR_TYPES.TIMEOUT_ERROR,
  409: ERROR_TYPES.VALIDATION_ERROR,
  422: ERROR_TYPES.VALIDATION_ERROR,
  429: ERROR_TYPES.SERVER_ERROR,
  500: ERROR_TYPES.SERVER_ERROR,
  502: ERROR_TYPES.SERVER_ERROR,
  503: ERROR_TYPES.SERVER_ERROR,
  504: ERROR_TYPES.TIMEOUT_ERROR,
};

// Error classification function
export const classifyError = (error) => {
  // Check for network errors
  if (error.message === 'Network request failed' || 
      error.message.includes('Network connection failed') ||
      error.message.includes('fetch')) {
    return ERROR_TYPES.NETWORK_ERROR;
  }

  // Check for timeout errors
  if (error.message.includes('timeout') || 
      error.message.includes('Request timeout')) {
    return ERROR_TYPES.TIMEOUT_ERROR;
  }

  // Check for authentication errors
  if (error.message.includes('Invalid credentials') ||
      error.message.includes('Authentication failed') ||
      error.message.includes('Invalid email or password') ||
      error.message.includes('Token expired') ||
      error.message.includes('Unauthorized')) {
    return ERROR_TYPES.AUTHENTICATION_ERROR;
  }

  // Check for validation errors
  if (error.message.includes('validation') ||
      error.message.includes('required') ||
      error.message.includes('invalid') ||
      error.message.includes('format')) {
    return ERROR_TYPES.VALIDATION_ERROR;
  }

  // Check for email verification errors
  if (error.message.includes('verification') ||
      error.message.includes('OTP') ||
      error.message.includes('code')) {
    return ERROR_TYPES.EMAIL_VERIFICATION_ERROR;
  }

  // Check for password reset errors
  if (error.message.includes('password reset') ||
      error.message.includes('reset link') ||
      error.message.includes('token')) {
    return ERROR_TYPES.PASSWORD_RESET_ERROR;
  }

  // Check for profile update errors
  if (error.message.includes('profile') ||
      error.message.includes('update failed')) {
    return ERROR_TYPES.PROFILE_UPDATE_ERROR;
  }

  // Check for image upload errors
  if (error.message.includes('image') ||
      error.message.includes('upload') ||
      error.message.includes('file')) {
    return ERROR_TYPES.IMAGE_UPLOAD_ERROR;
  }

  // Check for permission errors
  if (error.message.includes('permission') ||
      error.message.includes('camera') ||
      error.message.includes('gallery')) {
    return ERROR_TYPES.PERMISSION_ERROR;
  }

  // Check for storage errors
  if (error.message.includes('storage') ||
      error.message.includes('AsyncStorage') ||
      error.message.includes('local storage')) {
    return ERROR_TYPES.STORAGE_ERROR;
  }

  return ERROR_TYPES.UNKNOWN_ERROR;
};

// Show error alert with proper formatting
export const showErrorAlert = (errorType, customMessage = null, onPress = null) => {
  const errorConfig = ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_ERROR];
  
  Alert.alert(
    errorConfig.title,
    customMessage || errorConfig.message,
    [
      {
        text: errorConfig.action,
        onPress: onPress || (() => {}),
        style: errorType === ERROR_TYPES.AUTHENTICATION_ERROR ? 'default' : 'default'
      }
    ],
    { cancelable: true }
  );
};

// Handle API errors with proper classification
export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);
  
  const errorType = classifyError(error);
  const errorConfig = ERROR_MESSAGES[errorType];
  
  // Extract specific error message from server response
  let specificMessage = customMessage;
  if (!specificMessage && error.message) {
    // Clean up error message
    specificMessage = error.message
      .replace(/^Error: /, '')
      .replace(/^HTTP error! status: \d+ /, '')
      .replace(/Network request failed/, 'Connection failed');
  }
  
  showErrorAlert(errorType, specificMessage);
  
  return {
    type: errorType,
    message: specificMessage || errorConfig.message,
    originalError: error
  };
};

// Handle specific error scenarios
export const handleSpecificError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  
  // Add context-specific handling
  if (context === 'login') {
    if (error.message.includes('Email not verified')) {
      return {
        type: ERROR_TYPES.EMAIL_VERIFICATION_ERROR,
        message: 'Please verify your email before logging in.',
        requiresVerification: true
      };
    }
  }
  
  if (context === 'register') {
    if (error.message.includes('already exists') || error.message.includes('already registered')) {
      return {
        type: ERROR_TYPES.VALIDATION_ERROR,
        message: 'An account with this email already exists. Please try logging in instead.'
      };
    }
  }
  
  if (context === 'password_reset') {
    if (error.message.includes('Invalid token') || error.message.includes('expired')) {
      return {
        type: ERROR_TYPES.PASSWORD_RESET_ERROR,
        message: 'This reset link is invalid or has expired. Please request a new one.'
      };
    }
  }
  
  if (context === 'profile_update') {
    if (error.message.includes('image') || error.message.includes('upload')) {
      return {
        type: ERROR_TYPES.IMAGE_UPLOAD_ERROR,
        message: 'Failed to update profile image. Please try again with a different image.'
      };
    }
  }
  
  // Default error handling
  return handleApiError(error);
};

// Retry mechanism for failed requests
export const retryRequest = async (requestFunction, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFunction();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// Validate network connectivity
export const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      timeout: 5000 
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Show network connectivity error
export const showNetworkError = () => {
  showErrorAlert(ERROR_TYPES.NETWORK_ERROR, null, () => {
    // Optionally refresh the screen or retry
  });
};

// Error logging utility
export const logError = (error, context = '', additionalInfo = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    additionalInfo,
    userAgent: 'React Native App',
    platform: 'Mobile'
  };
  
  console.error('Error Log:', JSON.stringify(errorLog, null, 2));
  
  // In production, you might want to send this to a logging service
  // sendErrorToLoggingService(errorLog);
};

export default {
  ERROR_TYPES,
  ERROR_MESSAGES,
  classifyError,
  showErrorAlert,
  handleApiError,
  handleSpecificError,
  retryRequest,
  checkNetworkConnectivity,
  showNetworkError,
  logError
};
