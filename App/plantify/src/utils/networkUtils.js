// Network utilities for finding the correct IP address

export const getNetworkInfo = () => {
  // This function helps users find their IP address
  console.log(`
🔍 Finding your IP address for backend connection:

1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
2. Run: ipconfig (Windows) or ifconfig (Mac/Linux)
3. Look for your WiFi adapter (usually "Wireless LAN adapter Wi-Fi")
4. Find "IPv4 Address" - this is your IP address
5. Update src/config/api.js with your IP address

Common IP patterns:
- 192.168.1.x (most home networks)
- 192.168.0.x (some home networks) 
- 10.0.0.x (some networks)
- 172.16.x.x (corporate networks)

Example: If your IP is 192.168.1.50, update api.js to:
const API_BASE_URL = 'http://192.168.1.50:8000/api/account';
  `);
};

export const testConnection = async (baseUrl) => {
  try {
    const testUrl = `${baseUrl}/register/`;
    console.log('Testing connection to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Connection test response status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
};

export const getCommonIPs = () => {
  return [
    'http://localhost:8000/api/account',
    'http://127.0.0.1:8000/api/account',
    'http://10.0.2.2:8000/api/account',
    'http://192.168.1.100:8000/api/account',
    'http://192.168.0.100:8000/api/account',
    'http://10.0.0.100:8000/api/account',
  ];
};
