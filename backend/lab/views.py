from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views import generic
from django.shortcuts import render
from django.views.generic import DetailView
from django.utils.safestring import mark_safe
from .models import Classrooms, Users, Exercises, ClassroomExercises, ExerciseTests
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ClassroomSerializer

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


@api_view(['GET'])
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
            'teacher': classroom.creator_user.full_name,
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
def get_exercise_list(request, classroom_slug):
    if request.method != 'GET':
        return JsonResponse({
            'error': 'Only GET method is allowed'
        }, status=405)
        
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

@csrf_exempt  # Only for development! Use proper CSRF protection in production
def create_new_classroom(request):
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST method is allowed'
        }, status=405)
        
    try:
        # Parse the JSON data from request body
        data = json.loads(request.body)
        
        # Validate required fields
        if 'name' not in data:
            return JsonResponse({
                'error': 'Name is required'
            }, status=400)
            
        # Create classroom instance
        classroom = Classrooms(
            name=data['name'],
            description=data.get('description', ''),
            creator_user=Users.objects.get(username='jais')  # Temporary: Replace with actual authenticated user
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
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
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
def update_classroom(request, slug):
    if request.method != 'PUT':
        return JsonResponse({
            'error': 'Method not allowed'
        }, status=405)
    
    try:
        # Print request details for debugging
        print(f"Received request for slug: {slug}")
        print(f"Request body: {request.body.decode('utf-8')}")
        
        classroom = get_object_or_404(Classrooms, slug=slug)
        data = json.loads(request.body)
        
        # Update fields
        classroom.name = data.get('name', classroom.name)
        classroom.description = data.get('description', classroom.description)
        classroom.save()
        
        response_data = {
            'id': classroom.id,
            'name': classroom.name,
            'description': classroom.description,
            'teacher': classroom.creator_user.full_name,
            'createdAt': classroom.created_at.isoformat(),
            'updatedAt': classroom.updated_at.isoformat(),
            'slug': classroom.slug,
        }
        
        print(f"Sending response: {response_data}")
        return JsonResponse(response_data)
        
    except Classrooms.DoesNotExist:
        return JsonResponse({
            'error': 'Classroom not found'
        }, status=404)
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        print(f"Error in update_classroom: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)

@csrf_exempt
def delete_classroom_by_slug(request, slug):
    if request.method != 'DELETE':
        return JsonResponse({
            'error': 'Method not allowed'
        }, status=405)
    
    try:
        classroom = get_object_or_404(Classrooms, slug=slug)
        classroom.delete()
        
        return JsonResponse({
            'message': 'Classroom deleted successfully',
            'slug': slug
        })
        
    except Classrooms.DoesNotExist:
        return JsonResponse({
            'error': 'Classroom not found'
        }, status=404)
    except Exception as e:
        print(f"Error in delete_classroom: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)


# CRUD Exercise

@csrf_exempt
def create_new_exercise(request, classroom_slug):
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST method is allowed'
        }, status=405)
        
    try:
        # Get the classroom instance
        classroom = get_object_or_404(Classrooms, slug=classroom_slug)
        print(f"Found classroom: {classroom.name} (id: {classroom.id})")
        
        # Parse the JSON data from request body
        data = json.loads(request.body)
        print(f"Received data: {data}")
        
        # Validate required fields
        if 'name' not in data:
            return JsonResponse({
                'error': 'Name is required'
            }, status=400)
            
        try:
            # Create exercise instance
            exercise = Exercises(
                name=data['name'],
                instructions=data.get('instructions', ''),
                code=data.get('code', ''),
                creator_user=Users.objects.get(username='jais')
            )
            exercise.save()
            print(f"Created exercise: {exercise.name} (id: {exercise.id})")
            
            try:
                # Create the ClassroomExercises relationship
                classroom_exercise = ClassroomExercises.objects.create(
                    classroom=classroom,
                    exercise=exercise
                )
                print(f"Created classroom exercise relationship (id: {classroom_exercise.id})")
                
            except Exception as ce_error:
                # If ClassroomExercises creation fails, delete the exercise
                exercise.delete()
                print(f"Error creating classroom exercise relationship: {str(ce_error)}")
                raise ce_error
            
            # Return the created exercise data
            return JsonResponse({
                'id': str(exercise.id),  # Convert UUID to string
                'name': exercise.name,
                'slug': exercise.slug,
                'instructions': exercise.instructions,
                'code': exercise.code,
                'created_at': exercise.created_at.isoformat(),
                'classroom_slug': classroom_slug
            }, status=201)
            
        except Exception as e:
            print(f"Error creating exercise: {str(e)}")
            raise e
            
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        print(f"Error in create_new_exercise: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)



@csrf_exempt
def update_exercise_by_id(request, exercise_id):
    if request.method != 'PUT':
        return JsonResponse({
            'error': 'Method not allowed'
        }, status=405)
    
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
def delete_exercise_by_id(request, exercise_id):
    if request.method != 'DELETE':
        return JsonResponse({
            'error': 'Method not allowed'
        }, status=405)
    
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
    if request.method != 'GET':
        return JsonResponse({
            'error': 'Only GET method is allowed'
        }, status=405)
        
    try:
        exercise = get_object_or_404(Exercises, id=exercise_id)
        
        # Prepare the response data
        response_data = {
            'id': str(exercise.id),  # Convert UUID to string
            'name': exercise.name,
            'slug': exercise.slug,
            'instructions': exercise.instructions,
            'code': exercise.code,
            'creator': {
                'id': exercise.creator_user.id,
                'full_name': exercise.creator_user.full_name,
                'username': exercise.creator_user.username
            },
            'created_at': exercise.created_at.isoformat(),
            'updated_at': exercise.updated_at.isoformat()
        }
        
        return JsonResponse(response_data)
        
    except Exercises.DoesNotExist:
        return JsonResponse({
            'error': 'Exercise not found'
        }, status=404)
    except Exception as e:
        print(f"Error in get_exercise_details: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)
