from django.urls import path

from .views import home, codemirror_test

from .views import ClassroomsView, ClassroomView, classroom_form, create_classroom,  edit_classroom, delete_classroom 

from .views import get_classroom_details, get_classrooms_list, create_new_classroom, update_classroom, delete_classroom_by_slug

from .views import ExerciseView, exercise_form, create_exercise, edit_exercise, delete_exercise

urlpatterns = [
    path('', home, name='home'),
    
    # Display all classrooms list
    # path('classrooms', ClassroomsView.as_view(), name='classrooms'),
    path('classrooms', get_classrooms_list, name='get_classrooms_list'),
   
    # Display a classroom
    # path('classroom/<int:pk>/', ClassroomView.as_view(), name='classroom_detail'),
    path('classroom/<slug:slug>/', get_classroom_details, name='get_classroom_details'),
    
    # Display the form to create a new classroom
    path('classroom_form', classroom_form, name='classroom_form'),
    
    # Create a new classroom
    # path('create_classroom', create_classroom, name='create_classroom'),
    path('create_new_classroom', create_new_classroom, name='create_new_classroom'),
    
    # Edit a classroom
    path('edit/<int:pk>/', edit_classroom, name='edit_classroom'),
    path('update_classroom/<slug:slug>/', update_classroom, name='update_classroom'),
    
    # Delete a classroom
    path('delete/<int:pk>/', delete_classroom, name='delete_classroom'),
    path('delete_classroom/<slug:slug>/', delete_classroom_by_slug, name='delete_classroom_by_slug'),
    
    # Display an exercise
    path('exercise/<int:pk>/', ExerciseView.as_view(), name='exercise_detail'),
    # Display the form to create a new exercise
    path('classroom/<int:classroom_id>/exercise_form/', exercise_form, name='exercise_form'),
    # Create a new exercise
    path('classroom/<int:classroom_id>/create_exercise/',create_exercise, name='create_exercise'),
    # Edit an exercise
    path('exercise/edit/<int:pk>/', edit_exercise, name='edit_exercise'),
    # Delete an exercise
    path('exercise/delete/<int:pk>/', delete_exercise, name='delete_exercise'),

    path('codemirror-test/', codemirror_test, name='codemirror_test'),
]
