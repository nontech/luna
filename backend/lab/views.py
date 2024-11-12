from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views import generic
from django.shortcuts import render
from django.views.generic import DetailView
from django.utils.safestring import mark_safe
from .models import Classrooms, Users, Exercises, ClassroomExercises
from .forms import ClassroomForm, ExerciseForm
from django.views.decorators.csrf import csrf_exempt
import json

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

class ClassroomsView(generic.ListView):
    template_name = 'all_classrooms.html'
    context_object_name = 'classrooms'

    def get_queryset(self):
        return Classrooms.objects.all()

@csrf_exempt
def get_classrooms_list(request):
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

class ClassroomView(DetailView):
    model = Classrooms
    template_name = 'classroom.html'
    context_object_name = 'classroom'  # Optional; defaults to 'classrooms'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['exercises'] = Exercises.objects.all()
        return context

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

class ExerciseView(DetailView):
    model = Exercises
    template_name = 'exercise.html'
    context_object_name = 'exercise'  # Optional; defaults to 'exercises'

def classroom_form(request):
    # the form holds model instance
    return render(request, "classroom_form.html", {"form" : ClassroomForm()})

def create_classroom(request):
    if request.method == 'POST':
        form = ClassroomForm(request.POST)
        if form.is_valid():
            classroom = form.save(commit=False)  # Create the instance but don't save to the database yet
            classroom.creator_user = Users.objects.get(username='jais')  # Assign the creator_user
            classroom.save()  # Save the instance to the database
            # redirect it to corresponding classroom page
            return HttpResponseRedirect(reverse("classroom_detail", args=(classroom.id,)))
    else:
        form = ClassroomForm()
    
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

def edit_classroom(request, pk):
    classroom = get_object_or_404(Classrooms, pk=pk)
    if request.method == 'POST':
        form = ClassroomForm(request.POST, instance=classroom)
        if form.is_valid():
            form.save()
            # redirect it to corresponding classroom page
            return HttpResponseRedirect(reverse("classroom_detail", args=(classroom.id,)))
    else:
        form = ClassroomForm(instance=classroom)
    return render(request, 'classroom_form.html', {'form': form})

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

def delete_classroom(request, pk):
    classroom = get_object_or_404(Classrooms, pk=pk)
    if request.method == 'POST':
        classroom.delete()
        return HttpResponseRedirect(reverse('classrooms'))
    return render(request, 'classroom_confirm_delete.html', {'classroom': classroom})

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

# def exercise_form(request):
#     return render(request, "exercise_form.html", {"form" : ExerciseForm()})

def exercise_form(request, classroom_id):
    classroom = get_object_or_404(Classrooms, pk=classroom_id)
    form = ExerciseForm()

    return render(request, "exercise_form.html", {
        "form": form,
        "classroom": classroom
    })

def create_exercise(request, classroom_id):
    classroom = get_object_or_404(Classrooms, pk=classroom_id)
    
    if request.method == 'POST':
        form = ExerciseForm(request.POST)
        if form.is_valid():
            exercise = form.save(commit=False)  # Create the instance but don't save to the database yet
            exercise.creator_user = Users.objects.get(username='jais')  # Assign the creator_user
            exercise.save()  # Save the instance to the database
            # Create the ClassroomExercises entry
            ClassroomExercises.objects.create(classroom=classroom, exercise=exercise)
            # redirect it to corresponding exercise page
            return HttpResponseRedirect(reverse("exercise_detail", args=(exercise.id,)))
    else:
        form = ExerciseForm()
    
    return render(request, 'exercise_form.html', {'form': form, 'classroom': classroom})

def edit_exercise(request, pk):
    exercise = get_object_or_404(Exercises, pk=pk)
    if request.method == 'POST':
        form = ExerciseForm(request.POST, instance=exercise)
        if form.is_valid():
            form.save()
            # redirect it to corresponding exercise page
            return HttpResponseRedirect(reverse("exercise_detail", args=(exercise.id,)))
    else:
        form = ExerciseForm(instance=exercise)
    return render(request, 'exercise_form.html', {'form': form})

def delete_exercise(request, pk): 
    # In Django, when you define a foreign key field in a model, Django automatically creates a field with the suffix _id that stores the actual ID of the related object

    # In model ClassroomExercises, the foreign key field is exercise, so Django automatically created a field exercise_id which we can use to query exercise instance
    
    # Query the ClassroomExercises instance
    classroom_exercise = ClassroomExercises.objects.get(exercise_id=pk)
    
    # Access the related Classroom instance
    classroom = classroom_exercise.classroom
    
    # Get the Classroom ID
    classroom_id = classroom.id

    # Retrieve the exercise object or return a 404 if not found
    exercise = get_object_or_404(Exercises, pk=pk)

    if request.method == 'POST':
        # Delete the exercise
        exercise.delete()
        # Afer deleting the exercise, delete the ClassroomExercises entry as well
        classroom_exercise.delete()
        # then, redirect it to corresponding classroom page
        return HttpResponseRedirect(reverse('classroom_detail', args=(classroom_id,)))
    
    return render(request, 'exercise_confirm_delete.html', {'exercise': exercise})

    
