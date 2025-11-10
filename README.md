# PlantifyAI - Plant Disease Detection Prediction System

PlantifyAI is a comprehensive plant disease prediction system that combines the power of artificial intelligence with web and mobile technologies to help farmers and gardeners identify and manage plant diseases effectively.

## Project Components

### 1. Backend (Django REST API)

- Built with Django and Django REST Framework
- Handles user authentication and management
- Processes plant disease detection using AI models
- Manages user profiles and disease detection history
- RESTful API endpoints for web and mobile clients
- Located in `/Backend` directory

### 2. Frontend (React + Vite)

- Modern web interface built with React and Vite
- Responsive design for all devices
- Interactive disease detection interface
- User dashboard for history and management
- Located in `/frontend` directory

### 3. Mobile App (React Native + Expo)

- Cross-platform mobile application (iOS & Android)
- Native camera integration for plant image capture
- Offline support capabilities
- Push notifications for alerts
- Located in `/App/plantify` directory

## Features

- 🌿 Real-time plant disease detection
- 👤 User authentication and profile management
- 📱 Cross-platform support (Web, iOS & Android)
- 📷 Native camera integration for image capture
- 📊 History tracking and analysis
- 📫 Contact support system
- 🎯 Disease identification with confidence scores
- 💡 Care recommendations and remedial steps

## Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.10 or higher)
- **pip** (Python package manager)
- **npm** (Node package manager)
- **Expo CLI** (for mobile app development)
- **Git** (version control)

## Project Structure

```
PlantifyAI/
├── Backend/                    # Django REST API backend
│   ├── Plantify/              # Main Django project
│   ├── requirements.txt        # Python dependencies
│   └── manage.py              # Django management script
│
├── frontend/                   # React web frontend
│   ├── src/                   # Source code
│   ├── package.json           # npm dependencies
│   └── vite.config.js         # Vite configuration
│
├── App/                        # React Native mobile app
│   └── plantify/              # Expo project root
│       ├── app/               # App screens and routing
│       ├── src/               # Components, services, utils
│       ├── package.json       # npm dependencies
│       └── app.json           # Expo configuration
│
└── README.md                   # This file
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd Backend
   ```

2. Create and activate virtual environment:

   ```bash
   # Windows
   python -m venv env
   .\env\Scripts\activate

   # Linux/Mac
   python -m venv env
   source env/bin/activate
   ```

3. Install dependencies:

   ```bash
   cd Plantify
   pip install -r requirements.txt
   ```

4. Create `.env` file with database and API configuration:

   ```bash
   # .env example
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///db.sqlite3
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. Create superuser (admin account):

   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```
   Backend runs at: `http://localhost:8000`

### Web Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file with backend API URL:

   ```bash
   # .env example
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Frontend runs at: `http://localhost:5173`

5. Build for production:
   ```bash
   npm run build
   ```

### Mobile App Setup

1. Navigate to the mobile app directory:

   ```bash
   cd App/plantify
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Expo CLI globally (if not already installed):

   ```bash
   npm install -g expo-cli
   ```

4. Create `.env` file with backend API URL:

   ```bash
   # .env example
   EXPO_PUBLIC_API_BASE_URL=http://your-backend-ip:8000/api
   ```

5. Start the Expo development server:

   ```bash
   # For iOS simulator
   expo start --ios

   # For Android emulator
   expo start --android

   # For Expo Go app (scan QR code)
   expo start
   ```

6. Build for production:

   ```bash
   # iOS
   eas build --platform ios

   # Android
   eas build --platform android
   ```

## Technologies Used

### Backend

- **Django** - Web framework
- **Django REST Framework** - API development
- **TensorFlow/PyTorch** - AI/ML models for disease detection
- **SQLite/PostgreSQL** - Database
- **Celery** - Async task queue (optional)
- **Pillow** - Image processing

### Web Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **TailwindCSS** - Styling

### Mobile App

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - App routing
- **NativeWind/TailwindCSS** - Mobile styling
- **Expo Camera** - Native camera access
- **React Native Modal DateTime Picker** - Date selection
- **AsyncStorage** - Local data storage

## Development Workflow

### Running All Services Simultaneously

1. **Terminal 1 - Backend**:

   ```bash
   cd Backend/Plantify
   source env/bin/activate  # or .\env\Scripts\activate on Windows
   python manage.py runserver
   ```

2. **Terminal 2 - Web Frontend**:

   ```bash
   cd frontend
   npm run dev
   ```

3. **Terminal 3 - Mobile App**:
   ```bash
   cd App/plantify
   expo start
   ```

### API Documentation

- Backend API docs available at: `http://localhost:8000/api/docs` or `http://localhost:8000/api/schema`
- Check `Backend/BACKEND_SETUP.md` for detailed backend configuration

## Configuration Notes

### Backend API CORS

Ensure CORS is configured in Django settings to allow requests from:

- `http://localhost:5173` (web frontend)
- `http://localhost:19000` (Expo dev server)
- `*` (for mobile app in development)

### Image Upload

- Configure media storage for plant images
- Set appropriate file size limits in backend
- Use image compression before sending from mobile/web

### Authentication

- JWT tokens for web and mobile authentication
- Token refresh mechanism for long-lived sessions
- Secure token storage using AsyncStorage (mobile) and localStorage (web)

## Troubleshooting

### Backend Issues

- **Port 8000 in use**: `python manage.py runserver 8001`
- **Database errors**: Run `python manage.py migrate --run-syncdb`
- **Missing dependencies**: `pip install -r requirements.txt --upgrade`

### Frontend Issues

- **Port 5173 in use**: `npm run dev -- --port 3000`
- **Module not found**: Delete `node_modules` and `package-lock.json`, then `npm install`
- **API connection errors**: Check `VITE_API_BASE_URL` in `.env`

### Mobile App Issues

- **Metro bundler errors**: Run `expo start -c` (clear cache)
- **API connection errors**: Ensure backend IP is correct in `.env`
- **Camera permissions**: Check app permissions in device settings
- **Build errors**: Delete `node_modules` and `.expo`, then `npm install && expo start`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact us through the application's contact form or create an issue in the repository.

---

**Last Updated**: November 10, 2025
