
// List of possible API URLs to try
const POSSIBLE_URLS = [
  'http://10.221.156.254:8000/account',         // Current IP address    
  'http://localhost:8000/account',              
  'http://127.0.0.1:8000/account',
  'http://10.0.2.2:8000/account',              // Android emulator
];

// Function to test which URL works
const findWorkingURL = async () => {
  console.log('🔍 Testing API URLs...');
  for (const url of POSSIBLE_URLS) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(url + '/register/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });
      if (response.ok || response.status === 405) { // 405 means method not allowed, but server is reachable
        console.log('✅ Found working API URL:', url);
        return url;
      }
    } catch (error) {
      console.log('❌ Failed to connect to:', url, error.message);
    }
  }
  console.log('❌ No working API URL found. Please check if backend is running.');
  return POSSIBLE_URLS[0]; // Fallback to first URL
};

// Initialize with the most likely working URL
let API_BASE_URL = 'http://10.221.156.254:8000/account';

// Function to initialize API configuration
export const initializeAPIConfig = async () => {
  try {
    console.log('🚀 Initializing API configuration...');
    const workingURL = await findWorkingURL();
    API_BASE_URL = workingURL;
    console.log('✅ API initialized with URL:', API_BASE_URL);
    return API_BASE_URL;
  } catch (error) {
    console.error('❌ API initialization failed:', error);
    return API_BASE_URL; // Return current URL as fallback
  }
};

// Function to get current API base URL
export const getAPIBaseURL = () => {
  return API_BASE_URL;
};

// Function to update API base URL
export const updateAPIBaseURL = (newURL) => {
  API_BASE_URL = newURL;
  console.log('🔄 API URL updated to:', API_BASE_URL);
};

// Export both the URL and the function to find working URL
export default API_BASE_URL;
export { findWorkingURL, POSSIBLE_URLS };
