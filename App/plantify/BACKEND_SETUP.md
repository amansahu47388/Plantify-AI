# Backend Integration Setup

This document explains how to set up the backend integration for the PlantifyAI React Native app.

## Prerequisites

1. Python 3.8+ installed
2. Django backend running (in the Backend folder)
3. React Native app running (in the App/plantify folder)

## Backend Setup

1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run database migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the Django development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

## Frontend Configuration

### Quick IP Detection (Recommended)
1. Run the IP detection script:
   ```bash
   cd App/plantify
   node find-ip.js
   ```
   This will automatically find and display your IP address.

### Manual IP Detection
1. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - Mac/Linux: Run `ifconfig` in Terminal
   - Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)

2. Update the API configuration:
   - Open `App/plantify/src/config/api.js`
   - Replace `192.168.1.100` with your actual IP address
   - Example: `const API_BASE_URL = 'http://192.168.1.50:8000/api/account';`

3. Update backend CORS settings (if needed):
   - Open `Backend/Plantify/settings.py`
   - Add your IP address to `CORS_ALLOWED_ORIGINS` if not already there

## Testing the Integration

1. Start the backend server:
   ```bash
   cd Backend
   python manage.py runserver 0.0.0.0:8000
   ```

2. Start the React Native app:
   ```bash
   cd App/plantify
   npm start
   ```

3. Test the signup flow:
   - Open the app
   - Go to Sign Up
   - Fill in the form
   - Submit and check if you receive a verification email
   - Check the backend console for the OTP code (in DEBUG mode)

## API Endpoints

The following endpoints are available:

- `POST /api/account/register/` - User registration
- `POST /api/account/login/` - User login
- `POST /api/account/verify-otp/` - Email verification
- `POST /api/account/resend-otp/` - Resend verification code
- `GET /api/account/profile/` - Get user profile
- `PUT /api/account/profile/` - Update user profile
- `POST /api/account/check-password-strength/` - Check password strength

## Troubleshooting

### Connection Issues

1. **"Network request failed"**: Check if the IP address is correct
2. **"CORS error"**: Make sure your IP is in the CORS_ALLOWED_ORIGINS list
3. **"Connection refused"**: Make sure the Django server is running on 0.0.0.0:8000

### Common IP Addresses

- Localhost: `http://localhost:8000` (won't work with React Native)
- Android Emulator: `http://10.0.2.2:8000`
- Physical Device: `http://YOUR_IP:8000` (replace YOUR_IP with your actual IP)

### Testing with Physical Device

1. Make sure your phone and computer are on the same WiFi network
2. Use your computer's IP address in the API configuration
3. Make sure the Django server is running with `0.0.0.0:8000` (not just `localhost:8000`)

## Features Implemented

✅ User Registration with email verification
✅ User Login with JWT tokens
✅ Email verification with OTP
✅ Password strength checking
✅ Token storage and management
✅ Profile management
✅ Error handling and validation
✅ Loading states and user feedback

## Next Steps

1. Test all authentication flows
2. Implement forgot password functionality
3. Add profile image upload
4. Test on physical devices
5. Deploy backend to production server
