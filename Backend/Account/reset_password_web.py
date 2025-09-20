from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import PasswordResetToken
from django.utils import timezone
from django.conf import settings
import json

@require_http_methods(["GET"])
def reset_password_web(request):
    """
    Web page that handles password reset links and redirects to mobile app
    """
    token = request.GET.get('token')
    
    if not token:
        return render(request, 'reset_password_error.html', {
            'error': 'Invalid reset link. No token provided.'
        })
    
    try:
        # Verify the token exists and is valid
        reset_token = PasswordResetToken.objects.get(token=token)
        
        # Check if token is expired
        if reset_token.is_expired():
            return render(request, 'reset_password_error.html', {
                'error': 'This reset link has expired. Please request a new password reset.'
            })
        
        # Check if token is already used
        if reset_token.is_used:
            return render(request, 'reset_password_error.html', {
                'error': 'This reset link has already been used. Please request a new password reset.'
            })
        
        # Render the reset password page with the token
        return render(request, 'reset_password_web.html', {
            'token': token,
            'user_email': reset_token.user.email
        })
        
    except PasswordResetToken.DoesNotExist:
        return render(request, 'reset_password_error.html', {
            'error': 'Invalid reset link. Please request a new password reset.'
        })
    except Exception as e:
        return render(request, 'reset_password_error.html', {
            'error': f'An error occurred: {str(e)}'
        })

@require_http_methods(["POST"])
@csrf_exempt
def reset_password_api(request):
    """
    API endpoint to reset password from web page
    """
    try:
        data = json.loads(request.body)
        token = data.get('token')
        new_password = data.get('new_password')
        
        if not token or not new_password:
            return HttpResponse(
                json.dumps({'error': 'Token and new password are required'}),
                content_type='application/json',
                status=400
            )
        
        # Get the reset token
        reset_token = PasswordResetToken.objects.get(token=token)
        
        if reset_token.is_expired() or reset_token.is_used:
            return HttpResponse(
                json.dumps({'error': 'Invalid or expired token'}),
                content_type='application/json',
                status=400
            )
        
        # Reset the password
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        reset_token.is_used = True
        reset_token.used_at = timezone.now()
        reset_token.save()
        
        return HttpResponse(
            json.dumps({'success': 'Password reset successfully'}),
            content_type='application/json'
        )
        
    except PasswordResetToken.DoesNotExist:
        return HttpResponse(
            json.dumps({'error': 'Invalid token'}),
            content_type='application/json',
            status=400
        )
    except Exception as e:
        return HttpResponse(
            json.dumps({'error': str(e)}),
            content_type='application/json',
            status=500
        )
