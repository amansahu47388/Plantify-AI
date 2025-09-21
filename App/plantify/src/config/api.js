
// List of possible API URLs to try
const POSSIBLE_URLS = [
  'http://10.236.101.101:8000/account',       
  'http://localhost:8000/account',              
  'http://127.0.0.1:8000/account',            
];

// Function to test which URL works
const findWorkingURL = async () => {
  for (const url of POSSIBLE_URLS) {
    try {
      const response = await fetch(url + '/register/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok || response.status === 405) { // 405 means method not allowed, but server is reachable
        console.log('✅ Found working API URL:', url);
        return url;
      }
    } catch (error) {
      console.log('❌ Failed to connect to:', url);
    }
  }
  console.log('❌ No working API URL found. Please check if backend is running.');
  return POSSIBLE_URLS[0]; // Fallback to localhost
};

// For now, use the most likely working URL
// You can change this to your preferred URL
// const API_BASE_URL = 'http://10.236.101.101:8000/account';
const API_BASE_URL = 'http://10.248.221.101:8000/account';

// Export both the URL and the function to find working URL
export default API_BASE_URL;
export { findWorkingURL, POSSIBLE_URLS };
