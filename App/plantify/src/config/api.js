
import { detectWorkingIP, getCachedIP } from '../utils/ipDetector';

// Dynamic API base URL - will be set by IP detection
let API_BASE_URL = 'http://localhost:8000/account'; // Default fallback

// Function to initialize API configuration
export const initializeAPIConfig = async () => {
  try {
    console.log('🚀 Initializing API configuration...');
    
    // First try to get cached IP
    const cachedIP = await getCachedIP();
    if (cachedIP) {
      API_BASE_URL = cachedIP + '/account';
      console.log('📱 Using cached API URL:', API_BASE_URL);
      return API_BASE_URL;
    }
    
    // If no cache, detect working IP
    const workingIP = await detectWorkingIP();
    API_BASE_URL = workingIP + '/account';
    console.log('🔍 Detected API URL:', API_BASE_URL);
    
    return API_BASE_URL;
  } catch (error) {
    console.error('Error initializing API config:', error);
    API_BASE_URL = 'http://localhost:8000/account';
    return API_BASE_URL;
  }
};

// Function to get current API base URL
export const getAPIBaseURL = () => {
  return API_BASE_URL;
};

// Function to update API base URL (for manual updates)
export const updateAPIBaseURL = (newURL) => {
  API_BASE_URL = newURL;
  console.log('🔄 API URL updated to:', API_BASE_URL);
};

// Export the default API base URL
export default API_BASE_URL;
