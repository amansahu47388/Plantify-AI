import { apiRequest, API_ENDPOINTS, TokenManager } from '../utils/api';
import { handleSpecificError, retryRequest, logError } from '../utils/errorHandler';

// Authentication Service
export const AuthService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          body: JSON.stringify({
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            password: userData.password,
            password2: userData.confirmPassword,
          }),
        });
      });

      return {
        success: true,
        data: response.data,
        message: response.success || 'Account created successfully!',
      };
    } catch (error) {
      logError(error, 'AuthService.register', { userData: { ...userData, password: '[HIDDEN]' } });
      const errorInfo = handleSpecificError(error, 'register');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.LOGIN, {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
        });
      });

      // Store tokens
      if (response.data.access && response.data.refresh) {
        await TokenManager.setTokens(response.data.access, response.data.refresh);
      }

      return {
        success: true,
        data: response.data,
        message: response.success || 'Login successful!',
      };
    } catch (error) {
      logError(error, 'AuthService.login', { email });
      const errorInfo = handleSpecificError(error, 'login');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
        requiresVerification: errorInfo.requiresVerification || error.message.includes('Email not verified'),
      };
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.VERIFY_OTP, {
          method: 'POST',
          body: JSON.stringify({
            email,
            otp,
          }),
        });
      });

      // Store tokens if verification successful
      if (response.data.access && response.data.refresh) {
        await TokenManager.setTokens(response.data.access, response.data.refresh);
      }

      return {
        success: true,
        data: response.data,
        message: response.success || 'Email verified successfully!',
      };
    } catch (error) {
      logError(error, 'AuthService.verifyOTP', { email });
      const errorInfo = handleSpecificError(error, 'email_verification');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.RESEND_OTP, {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        });
      });

      return {
        success: true,
        data: response,
        message: response.success || 'Verification code sent successfully!',
      };
    } catch (error) {
      logError(error, 'AuthService.resendOTP', { email });
      const errorInfo = handleSpecificError(error, 'email_verification');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Check password strength
  checkPasswordStrength: async (password) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.CHECK_PASSWORD_STRENGTH, {
          method: 'POST',
          body: JSON.stringify({
            password,
          }),
        });
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      logError(error, 'AuthService.checkPasswordStrength');
      const errorInfo = handleSpecificError(error, 'validation');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.PROFILE, {
          method: 'GET',
        });
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      logError(error, 'AuthService.getProfile');
      const errorInfo = handleSpecificError(error, 'profile');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      let requestOptions = {
        method: 'PUT',
      };

      // Check if profileData is FormData (for file uploads)
      if (profileData instanceof FormData) {
        // For file uploads, don't set Content-Type header
        // Let the browser set it with boundary for multipart/form-data
        requestOptions.body = profileData;
      } else {
        // For regular JSON data
        requestOptions.headers = {
          'Content-Type': 'application/json',
        };
        requestOptions.body = JSON.stringify(profileData);
      }

      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.PROFILE, requestOptions);
      });

      return {
        success: true,
        data: response,
        message: 'Profile updated successfully!',
      };
    } catch (error) {
      logError(error, 'AuthService.updateProfile', { 
        hasImage: profileData instanceof FormData,
        dataKeys: profileData instanceof FormData ? 'FormData' : Object.keys(profileData)
      });
      const errorInfo = handleSpecificError(error, 'profile_update');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await TokenManager.clearTokens();
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      logError(error, 'AuthService.logout');
      // Don't show error for logout as it's not critical
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    return await TokenManager.isAuthenticated();
  },

  // Password reset request
  requestPasswordReset: async (email) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.PASSWORD_RESET_REQUEST, {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        });
      });

      return {
        success: true,
        data: response,
        message: response.success || 'Password reset link sent to your email!',
      };
    } catch (error) {
      logError(error, 'AuthService.requestPasswordReset', { email });
      const errorInfo = handleSpecificError(error, 'password_reset');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Verify password reset token
  verifyPasswordResetToken: async (token) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.PASSWORD_RESET_VERIFY, {
          method: 'POST',
          body: JSON.stringify({
            token,
          }),
        });
      });

      return {
        success: true,
        data: response,
        message: response.success || 'Token is valid!',
      };
    } catch (error) {
      logError(error, 'AuthService.verifyPasswordResetToken', { token: token.substring(0, 10) + '...' });
      const errorInfo = handleSpecificError(error, 'password_reset');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Confirm password reset
  confirmPasswordReset: async (token, newPassword) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.PASSWORD_RESET_CONFIRM, {
          method: 'POST',
          body: JSON.stringify({
            token,
            new_password: newPassword,
          }),
        });
      });

      return {
        success: true,
        data: response,
        message: response.success || 'Password reset successfully!',
      };
    } catch (error) {
      logError(error, 'AuthService.confirmPasswordReset', { token: token.substring(0, 10) + '...' });
      const errorInfo = handleSpecificError(error, 'password_reset');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await retryRequest(async () => {
        return await apiRequest(API_ENDPOINTS.CHANGE_PASSWORD, {
          method: 'POST',
          body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: newPassword,
          }),
        });
      });

      return {
        success: true,
        data: response,
        message: response.success || 'Password changed successfully!',
      };
    } catch (error) {
      logError(error, 'AuthService.changePassword');
      const errorInfo = handleSpecificError(error, 'password_change');
      return {
        success: false,
        error: errorInfo.message,
        type: errorInfo.type,
      };
    }
  },
};