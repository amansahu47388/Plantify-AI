#!/usr/bin/env python
"""
Script to start Django development server with proper configuration for mobile development.
This script ensures the server binds to all interfaces (0.0.0.0) so mobile devices can connect.
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def main():
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Plantify.settings')
    
    # Setup Django
    django.setup()
    
    print("🚀 Starting PlantifyAI Backend Server...")
    print("📱 Server will be accessible from mobile devices on the same network")
    print("🌐 Server URL: http://10.236.101.101:8000")
    print("📋 API Endpoints:")
    print("   - Account: http://10.236.101.101:8000/account/")
    print("   - Crop Disease: http://10.236.101.101:8000/crop-disease/")
    print("\n⚠️  Make sure both your computer and mobile device are on the same WiFi network!")
    print("🔄 Press Ctrl+C to stop the server\n")
    
    # Start the server binding to all interfaces
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    main()
