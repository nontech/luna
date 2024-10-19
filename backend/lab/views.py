from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from django.shortcuts import render
from django.views.generic import DetailView
from django.utils.safestring import mark_safe
from .models import Classrooms, Users, Exercises, ClassroomExercises
from .forms import ClassroomForm, ExerciseForm

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


class ClassroomView(DetailView):
    model = Classrooms
    template_name = 'classroom.html'
    context_object_name = 'classroom'  # Optional; defaults to 'classrooms'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['exercises'] = Exercises.objects.all()
        return context

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
    
    return render(request, 'classroom_form.html', {'form': form})

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

def delete_classroom(request, pk):
    classroom = get_object_or_404(Classrooms, pk=pk)
    if request.method == 'POST':
        classroom.delete()
        return HttpResponseRedirect(reverse('classrooms'))
    return render(request, 'classroom_confirm_delete.html', {'classroom': classroom})


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

    
