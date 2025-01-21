# Imports
import json
import os

# Django
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse

# Settings
from django.conf import settings

# Views
from django.views import generic
from django.views.generic import DetailView
from django.views.decorators.csrf import csrf_exempt

# Safestring
from django.utils.safestring import mark_safe

# REST
from rest_framework import viewsets
from rest_framework.decorators import (
    api_view, 
    permission_classes,
    authentication_classes
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import ClassroomSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

# Models
from .models import Classrooms, Exercises, ClassroomExercises, ExerciseTests, Tests
from django.contrib.auth.models import User

# Auth
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.views.decorators.cache import never_cache
from django.contrib.auth.decorators import permission_required, login_required
from django.contrib.auth.backends import ModelBackend

# Email
from django.core.mail import EmailMessage, get_connection
from smtplib import SMTPAuthenticationError

# Forms
from .forms import EmailSignUpForm

# Examples of views

# This is a DRF view - requires authentication by default
@api_view(['GET'])
def get_user_details(request):  # Will require authentication
    ...

# This is a regular Django view - NOT affected by DRF permissions
def signup(request):  # Does NOT require authentication
    ...

# You can override the default permission for specific views
@api_view(['GET'])
@permission_classes([AllowAny])  # Override to allow unauthenticated access
def public_api_view(request):
    ...

# Create your views here.

def codemirror_test(request):
    initial_code = """
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

result = [fibonacci(i) for i in range(10)]
print(result)  # This will be captured by Pyodide
result  # This will be returned as the output
"""
    context = {'code': mark_safe(initial_code)}
    return render(request, 'codemirror_test.html', context)


def home(request):
    return render(request, 'home.html')

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_classrooms_list(request):
    """
    List all classrooms.
    
    Returns:
        A list of all classrooms with their details including:
        - id
        - name
        - description
        - teacher
        - createdAt
        - updatedAt
        - slug
    """
    try:
        classrooms = Classrooms.objects.all()
        classrooms_data = [{
            'id': classroom.id,
            'name': classroom.name,
            'description': classroom.description,
            'teacher': classroom.creator_user.username,
            'createdAt': classroom.created_at.isoformat(),
            'updatedAt': classroom.updated_at.isoformat(),
            'slug': classroom.slug,
        } for classroom in classrooms]
        
        return JsonResponse({
            'classrooms': classrooms_data
        }, safe=False)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exercise_list(request, classroom_slug):
    try:
        # Get the classroom instance
        classroom = get_object_or_404(Classrooms, slug=classroom_slug)
        
        # Get all exercises for this classroom through ClassroomExercises
        classroom_exercises = ClassroomExercises.objects.filter(classroom=classroom)
        
        # Extract exercise data
        exercises_data = [{
            'id': ce.exercise.id,
            'name': ce.exercise.name,
            'slug': ce.exercise.slug,
            'instructions': ce.exercise.instructions,
            'code': ce.exercise.code,
            'created_at': ce.exercise.created_at.isoformat(),
            'updated_at': ce.exercise.updated_at.isoformat(),
        } for ce in classroom_exercises]
        
        return JsonResponse({
            'exercises': exercises_data
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

   
# CRUD Classroom

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_classroom(request):
    try:
        # Parse the JSON data from request body
        data = request.data
        
        # Validate required fields
        if 'name' not in data:
            return JsonResponse({
                'error': 'Name is required'
            }, status=400)
            
        # Create classroom instance
        classroom = Classrooms(
            name=data['name'],
            description=data.get('description', ''),
            creator_user=request.user  # Use the authenticated user
        )
        
        classroom.save()
        
        # Return the created classroom data
        return JsonResponse({
            'id': classroom.id,
            'name': classroom.name,
            'slug': classroom.slug,
            'description': classroom.description,
            'created_at': classroom.created_at.isoformat()
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
def get_classroom_details(request, slug):
    try:
        classroom = get_object_or_404(Classrooms, slug=slug)
        
        # Return classroom details as JSON
        classroom_data = {
            'id': classroom.id,
            'name': classroom.name,
            'description': classroom.description,
            'teacher': classroom.creator_user.full_name,
            'createdAt': classroom.created_at.isoformat(),
            'updatedAt': classroom.updated_at.isoformat(),
            'slug': classroom.slug,
            # Add any other fields you need
        }
        
        return JsonResponse(classroom_data)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)
 
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_classroom_by_slug(request, slug):
    """
    Update a classroom's details.
    Only the creator of the classroom can update it.
    """
    try:
        classroom = get_object_or_404(Classrooms, slug=slug)
        
        # Check if user is the creator of the classroom
        if classroom.creator_user != request.user:
            return JsonResponse({
                'error': 'You do not have permission to update this classroom'
            }, status=403)
        
        data = request.data
        classroom.name = data.get('name', classroom.name)
        classroom.description = data.get('description', classroom.description)
        classroom.save()
        
        return JsonResponse({
            'id': classroom.id,
            'name': classroom.name,
            'description': classroom.description,
            'teacher': classroom.creator_user.username,
            'createdAt': classroom.created_at.isoformat(),
            'updatedAt': classroom.updated_at.isoformat(),
            'slug': classroom.slug,
        })
        
    except Classrooms.DoesNotExist:
        return JsonResponse({
            'error': 'Classroom not found'
        }, status=404)
    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error updating classroom {slug}: {str(e)}")
        return JsonResponse({
            'error': 'An unexpected error occurred'
        }, status=500)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_classroom_by_slug(request, slug):
    try:
        classroom = get_object_or_404(Classrooms, slug=slug)
        
        # Check if user is the creator of the classroom
        if classroom.creator_user != request.user:
            return JsonResponse({
                'error': 'You do not have permission to delete this classroom'
            }, status=403)

        # Get all exercises associated with this classroom
        classroom_exercises = ClassroomExercises.objects.filter(classroom=classroom)
        
        # Delete all associated exercises
        for ce in classroom_exercises:
            # Delete the exercise itself
            ce.exercise.delete()
            # The classroom_exercise entry will be automatically deleted due to CASCADE
        
        # Delete the classroom (this will automatically delete classroom_exercises entries)
        classroom.delete()
        
        return JsonResponse({
            'message': 'Classroom and all associated exercises deleted successfully',
            'slug': slug
        })
        
    except Classrooms.DoesNotExist:
        return JsonResponse({
            'error': 'Classroom not found'
        }, status=404)
    except Exception as e:
        # Log the error for debugging
        print(f"Error deleting classroom {slug}: {str(e)}")
        return JsonResponse({
            'error': 'An unexpected error occurred'
        }, status=500)

# CRUD Exercise

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_exercise(request, classroom_slug):
    try:
        # Get the classroom instance
        classroom = get_object_or_404(Classrooms, slug=classroom_slug)
        
        # Parse the JSON data from request body
        data = request.data  # DRF already parses JSON
        
        # Validate required fields
        if 'name' not in data:
            return JsonResponse({
                'error': 'Name is required'
            }, status=400)
            
        # Create exercise instance
        exercise = Exercises(
            name=data['name'],
            instructions=data.get('instructions', ''),
            code=data.get('code', ''),
            creator_user=request.user
        )
        exercise.save()
        
        # Create the ClassroomExercises relationship
        classroom_exercise = ClassroomExercises.objects.create(
            classroom=classroom,
            exercise=exercise
        )
        
        # Return the created exercise data
        return JsonResponse({
            'id': str(exercise.id),
            'name': exercise.name,
            'slug': exercise.slug,
            'instructions': exercise.instructions,
            'code': exercise.code,
            'created_at': exercise.created_at.isoformat(),
            'classroom_slug': classroom_slug
        }, status=201)
            
    except Exception as e:
        # If anything fails, cleanup and return error
        if 'exercise' in locals():
            exercise.delete()
        print(f"Error in create_new_exercise: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_exercise_by_id(request, exercise_id):
    try:
        exercise = get_object_or_404(Exercises, id=exercise_id)
        data = json.loads(request.body)
        
        # Update fields
        exercise.name = data.get('name', exercise.name)
        exercise.instructions = data.get('instructions', exercise.instructions)
        exercise.code = data.get('code', exercise.code)
        exercise.save()
        
        response_data = {
            'id': exercise.id,
            'name': exercise.name,
            'slug': exercise.slug,
            'instructions': exercise.instructions,
            'code': exercise.code,
            'created_at': exercise.created_at.isoformat(),
            'updated_at': exercise.updated_at.isoformat(),
        }
        
        return JsonResponse(response_data)
        
    except Exercises.DoesNotExist:
        return JsonResponse({
            'error': 'Exercise not found'
        }, status=404)
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        print(f"Error in update_exercise: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_exercise_by_id(request, exercise_id):
    try:
        exercise = get_object_or_404(Exercises, id=exercise_id)
        
        # Delete the exercise
        exercise.delete()
        
        return JsonResponse({
            'message': 'Exercise deleted successfully',
            'id': exercise_id
        })
        
    except Exercises.DoesNotExist:
        return JsonResponse({
            'error': 'Exercise not found'
        }, status=404)
    except Exception as e:
        print(f"Error in delete_exercise: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exercise_details(request, exercise_id):
    """
    Get details of a specific exercise by its UUID.
    
    Args:
        request: The HTTP request
        exercise_id: UUID of the exercise
        
    Returns:
        JsonResponse containing:
        - id (UUID)
        - name
        - slug
        - instructions
        - code
        - creator_user details
        - created_at
        - updated_at
    """
        
    try:
        exercise = get_object_or_404(Exercises, id=exercise_id)
        
        response_data = {
            'id': str(exercise.id),
            'name': exercise.name,
            'slug': exercise.slug,
            'instructions': exercise.instructions,
            'code': exercise.code,
            'creator': {
                'id': exercise.creator_user.id,
                'username': exercise.creator_user.username,
                'full_name': f"{exercise.creator_user.first_name} {exercise.creator_user.last_name}".strip()
            },
            'created_at': exercise.created_at.isoformat(),
            'updated_at': exercise.updated_at.isoformat()
        }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@never_cache
def signup(request):
    if request.method == 'POST':
        form = EmailSignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            authenticated_user = authenticate(
                request, 
                username=user.username,
                password=form.cleaned_data['password1']
            )
            if authenticated_user:
                login(request, authenticated_user, backend='django.contrib.auth.backends.ModelBackend')
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(authenticated_user)
                
                response = HttpResponseRedirect('http://localhost:3000')
                
                # Set cookies with debug logging
                cookie_settings = {
                    'httponly': True,
                    'secure': settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    'samesite': 'Lax',
                    'path': '/',
                }
                
                response.set_cookie(
                    'access_token',
                    str(refresh.access_token),
                    max_age=3600,
                    **cookie_settings
                )
                response.set_cookie(
                    'refresh_token',
                    str(refresh),
                    max_age=86400,
                    **cookie_settings
                )
                
                return response
        else:
            print("Form errors:", form.errors)
    else:
        form = EmailSignUpForm()
    return render(request, 'registration/signup.html', {'form': form})

# Sample Django view
def test_email(request):
    try:
        # Debug: Print settings (but mask the actual key)
        api_key = settings.RESEND_SMTP_PASSWORD
        debug_info = {
            "host": settings.RESEND_SMTP_HOST,
            "port": settings.RESEND_SMTP_PORT,
            "username": settings.RESEND_SMTP_USERNAME,
            "api_key_length": len(api_key) if api_key else 0,
            "api_key_starts_with": api_key[:6] + "..." if api_key else None
        }
        print("Debug settings:", debug_info)  # This will show in your console

        subject = "Hello from Django SMTP"
        recipient_list = ["delivered@resend.dev"]
        from_email = "onboarding@resend.dev"
        message = "<strong>it works!</strong>"

        with get_connection(
            host=settings.RESEND_SMTP_HOST,
            port=settings.RESEND_SMTP_PORT,
            username=settings.RESEND_SMTP_USERNAME,
            password=settings.RESEND_SMTP_PASSWORD,
            use_tls=True,
            ) as connection:
                r = EmailMessage(
                      subject=subject,
                      body=message,
                      to=recipient_list,
                      from_email=from_email,
                      connection=connection).send()
        return JsonResponse({"status": "ok"})
    except SMTPAuthenticationError as e:
        return JsonResponse({
            "status": "error",
            "message": "SMTP Authentication failed. Please check your API key.",
            "details": str(e),
            "debug_info": debug_info
        }, status=401)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "message": str(e),
            "debug_info": debug_info
        }, status=500)

from .authentication import CookieJWTAuthentication

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # This is optional since it's the default
@authentication_classes([CookieJWTAuthentication])
def get_user_details(request):
    
    user = request.user
    return Response({
        'email': user.email,
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'date_joined': user.date_joined,
        'user_role': get_user_role(user)
    })


@never_cache
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            
            response = JsonResponse({
                'success': True,
                'redirect_url': 'http://localhost:3000'
            })
            
            # Set JWT token in HTTP-only cookie
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                httponly=True,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite='Lax',
                path='/',
                max_age=3600  # 1 hour
            )
            
            return response
        else:
            return JsonResponse({
                'success': False,
                'error': 'Invalid credentials'
            }, status=401)
            
    return render(request, 'registration/login.html')

@never_cache
@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        # Clear Session Authentication
        logout(request)

        response = HttpResponseRedirect('http://localhost:3000')
        
        # Clear JWT tokens
        # Only path and samesite are valid parameters for delete_cookie
        response.delete_cookie(
            'access_token',
            path='/',
            samesite='Lax'
        )
        response.delete_cookie(
            'refresh_token',
            path='/',
            samesite='Lax'
        )
        return response
        
    return render(request, 'registration/logout.html')

def get_user_role(user):
    """
    Returns user role based on group membership.
    Returns 'teacher' if user is in Teachers group
    Returns 'student' if user is in Students group
    Returns None if user has no role
    """
    if user.groups.filter(name='Teachers').exists():
        return 'teacher'
    elif user.groups.filter(name='Students').exists():
        return 'student'
    return None

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tests_list(request, exercise_id):
    """
    Get all tests for a specific exercise.
    """
    try:
        # Get all tests for this exercise through ExerciseTests
        exercise_tests = ExerciseTests.objects.filter(exercise_id=exercise_id)
        
        # Extract test data
        tests_data = [{
            'id': et.test.id,
            'name': et.test.name,
            'test_type': et.test.test_type,
            'expected_output': et.test.expected_output,
            'help_text': et.test.help_text,
            'created_at': et.test.created_at.isoformat(),
            'updated_at': et.test.updated_at.isoformat(),
        } for et in exercise_tests]
        
        return JsonResponse({
            'tests': tests_data
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_new_test(request, exercise_id):
    """
    Create a new test for an exercise.
    """
    try:
        # Get the exercise instance
        exercise = get_object_or_404(Exercises, id=exercise_id)
        
        # Parse the JSON data from request body
        data = request.data
        
        # Validate required fields
        required_fields = ['name', 'test_type', 'expected_output']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    'error': f'{field} is required'
                }, status=400)
        
        # Validate test_type
        if data['test_type'] not in ['includes', 'exact']:
            return JsonResponse({
                'error': 'test_type must be either "includes" or "exact"'
            }, status=400)
            
        # Create test instance
        test = Tests(
            name=data['name'],
            test_type=data['test_type'],
            expected_output=data['expected_output'],
            help_text=data.get('help_text', '')
        )
        test.save()
        
        # Create the ExerciseTests relationship
        exercise_test = ExerciseTests.objects.create(
            exercise=exercise,
            test=test
        )
        
        # Return the created test data
        return JsonResponse({
            'id': test.id,
            'name': test.name,
            'test_type': test.test_type,
            'expected_output': test.expected_output,
            'help_text': test.help_text,
            'created_at': test.created_at.isoformat(),
            'exercise_id': str(exercise_id)
        }, status=201)
            
    except Exception as e:
        # If anything fails, cleanup and return error
        if 'test' in locals():
            test.delete()
        print(f"Error in create_new_test: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_test_details(request, test_id):
    """
    Get details of a specific test.
    """
    try:
        test = get_object_or_404(Tests, id=test_id)
        
        response_data = {
            'id': test.id,
            'name': test.name,
            'test_type': test.test_type,
            'expected_output': test.expected_output,
            'help_text': test.help_text,
            'created_at': test.created_at.isoformat(),
            'updated_at': test.updated_at.isoformat()
        }
        
        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_test_by_id(request, test_id):
    """
    Update a test's details.
    """
    try:
        test = get_object_or_404(Tests, id=test_id)
        data = request.data
        
        # Update fields
        if 'name' in data:
            test.name = data['name']
        if 'test_type' in data:
            if data['test_type'] not in ['includes', 'exact']:
                return JsonResponse({
                    'error': 'test_type must be either "includes" or "exact"'
                }, status=400)
            test.test_type = data['test_type']
        if 'expected_output' in data:
            test.expected_output = data['expected_output']
        if 'help_text' in data:
            test.help_text = data['help_text']
            
        test.save()
        
        response_data = {
            'id': test.id,
            'name': test.name,
            'test_type': test.test_type,
            'expected_output': test.expected_output,
            'help_text': test.help_text,
            'created_at': test.created_at.isoformat(),
            'updated_at': test.updated_at.isoformat()
        }
        
        return JsonResponse(response_data)
        
    except Tests.DoesNotExist:
        return JsonResponse({
            'error': 'Test not found'
        }, status=404)
    except Exception as e:
        print(f"Error in update_test: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_test_by_id(request, test_id):
    """
    Delete a test.
    """
    try:
        test = get_object_or_404(Tests, id=test_id)
        
        # Delete the test
        test.delete()
        
        return JsonResponse({
            'message': 'Test deleted successfully',
            'id': test_id
        })
        
    except Tests.DoesNotExist:
        return JsonResponse({
            'error': 'Test not found'
        }, status=404)
    except Exception as e:
        print(f"Error in delete_test: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)