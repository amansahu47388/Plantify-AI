// Quick script to help find your IP address
// Run this with: node find-ip.js

const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

const ip = getLocalIPAddress();
console.log(`
🌐 Your IP Address: ${ip}

📝 Update your API configuration:
1. Open: src/config/api.js
2. Replace the IP address with: ${ip}
3. Example: const API_BASE_URL = 'http://${ip}:8000/api/account';

🔧 Backend Setup:
1. Start backend: cd Backend && python manage.py runserver 0.0.0.0:8000
2. Make sure both devices are on the same WiFi network
3. Test the connection in your React Native app

📱 Common IP patterns:
- 192.168.1.x (most home networks)
- 192.168.0.x (some home networks)
- 10.0.0.x (some networks)
- 172.16.x.x (corporate networks)

✅ If this doesn't work, try these alternatives:
- http://localhost:8000/api/account (if running on same machine)
- http://10.0.2.2:8000/api/account (Android emulator)
- http://127.0.0.1:8000/api/account (localhost alternative)
`);
