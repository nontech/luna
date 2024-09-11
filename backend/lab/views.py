from django.shortcuts import get_object_or_404, render

# from .models import Classrooms

# Create your views here.
from django.http import HttpResponse

# dummy data
classrooms_data = [
        {
            'id': 0,
            'name': 'Basics of Python Programming'
        },
        {
            'id': 1,
            'name': 'Frontend Web Development'
        },
        {
            'id': 2,
            'name': 'CI/CD with Jenkins'
        }
    ]

exercises_data = [
        {
            'id': 0,
            'name': 'Python Variables',
        },
        {
            'id': 1,
            'name': 'Python Data Types',
        },
        {
            'id': 2,
            'name': 'Python Operators',
        }
    ]

def home(request):
    return render(request, 'home.html')

def classrooms(request):
    # later get the classrooms list from the database
    # dummy classrooms data for now
    return render(request, 'all_classrooms.html', {'classrooms': classrooms_data})

def classroom(request, classroom_id):
    # later we will fetch the classroom from the database
    # classroom = get_object_or_404(Classrooms, pk=classroom_id)
    
    # for now dummy data
    classroom = classrooms_data[classroom_id]
    all_exercises = exercises_data

    return render(request, 'classroom.html', {'classroom': classroom, 'exercises': all_exercises})

def exercise(request, exercise_id):
    # later we will fetch the exercise from the database

    # for now dummy data
    exercise = exercises_data[exercise_id]
    
    return render(request, 'exercise.html', {'exercise': exercise})
