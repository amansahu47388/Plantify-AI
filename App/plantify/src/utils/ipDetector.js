// IP Detection Utility for React Native
// This utility helps automatically detect the correct IP address for API calls

import AsyncStorage from '@react-native-async-storage/async-storage';

// List of common IP patterns to try
const COMMON_IP_PATTERNS = [
  '192.168.1.',    // Most home networks
  '192.168.0.',    // Some home networks  
  '10.0.0.',       // Some networks
  '10.18.',        // Your current network pattern
  '172.16.',       // Corporate networks
  'localhost',      // Local development
  '127.0.0.1',     // Localhost alternative
];

// Common ports to try
const COMMON_PORTS = [8000, 3000, 5000, 8080];

// Cache for detected IP
const IP_CACHE_KEY = 'detected_api_ip';
const IP_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Generate possible IP addresses to test
 */
const generatePossibleIPs = () => {
  const possibleIPs = [];
  
  // Add localhost variants
  possibleIPs.push('http://localhost:8000');
  possibleIPs.push('http://127.0.0.1:8000');
  
  // Add common network patterns (this is a simplified approach)
  // In a real implementation, you might want to use a more sophisticated method
  possibleIPs.push('http://10.18.80.254:8000'); // Your current IP pattern
  possibleIPs.push('http://192.168.1.100:8000');
  possibleIPs.push('http://192.168.0.100:8000');
  
  return possibleIPs;
};

/**
 * Test if an API endpoint is reachable
 */
const testAPIEndpoint = async (baseUrl) => {
  try {
    const testUrl = `${baseUrl}/account/register/`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(testUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    // Consider it successful if we get any response (even 405 Method Not Allowed)
    return response.status === 200 || response.status === 405;
  } catch (error) {
    return false;
  }
};

/**
 * Detect the working API IP address
 */
export const detectWorkingIP = async () => {
  try {
    // Check cache first
    const cachedData = await AsyncStorage.getItem(IP_CACHE_KEY);
    if (cachedData) {
      const { ip, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      
      // Use cached IP if it's still fresh
      if (now - timestamp < IP_CACHE_EXPIRY) {
        console.log('✅ Using cached IP:', ip);
        return ip;
      }
    }
    
    console.log('🔍 Detecting working API IP...');
    
    const possibleIPs = generatePossibleIPs();
    const results = [];
    
    // Test all possible IPs concurrently
    const promises = possibleIPs.map(async (ip) => {
      const isWorking = await testAPIEndpoint(ip);
      return { ip, isWorking };
    });
    
    const testResults = await Promise.all(promises);
    
    // Find the first working IP
    const workingIP = testResults.find(result => result.isWorking);
    
    if (workingIP) {
      console.log('✅ Found working IP:', workingIP.ip);
      
      // Cache the working IP
      await AsyncStorage.setItem(IP_CACHE_KEY, JSON.stringify({
        ip: workingIP.ip,
        timestamp: Date.now()
      }));
      
      return workingIP.ip;
    } else {
      console.log('❌ No working IP found, using fallback');
      return 'http://localhost:8000'; // Fallback
    }
    
  } catch (error) {
    console.error('Error detecting IP:', error);
    return 'http://localhost:8000'; // Fallback
  }
};

/**
 * Clear the IP cache (useful for forcing re-detection)
 */
export const clearIPCache = async () => {
  try {
    await AsyncStorage.removeItem(IP_CACHE_KEY);
    console.log('🗑️ IP cache cleared');
  } catch (error) {
    console.error('Error clearing IP cache:', error);
  }
};

/**
 * Get the current cached IP (if any)
 */
export const getCachedIP = async () => {
  try {
    const cachedData = await AsyncStorage.getItem(IP_CACHE_KEY);
    if (cachedData) {
      const { ip } = JSON.parse(cachedData);
      return ip;
    }
    return null;
  } catch (error) {
    console.error('Error getting cached IP:', error);
    return null;
  }
};

/**
 * Update API configuration with detected IP
 */
export const updateAPIConfig = async () => {
  try {
    const workingIP = await detectWorkingIP();
    console.log('🔄 Updating API configuration with IP:', workingIP);
    
    // Store the working IP for use by other components
    await AsyncStorage.setItem('current_api_ip', workingIP);
    
    return workingIP;
  } catch (error) {
    console.error('Error updating API config:', error);
    return 'http://localhost:8000';
  }
};
