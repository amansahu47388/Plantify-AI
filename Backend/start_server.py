
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
    print("\n⚠️  Make sure both your computer and mobile device are on the same WiFi network!")
    print("🔄 Press Ctrl+C to stop the server\n")
    
    # Start the server binding to all interfaces
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    main()
