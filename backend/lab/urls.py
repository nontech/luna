from django.urls import path

from .views import home, classrooms, classroom, exercise

urlpatterns = [
    path('', home, name='home'),
    # ex: /classrooms/
    path('classrooms', classrooms, name='classrooms'),
    # ex: /classroom/5/
    path('classroom/<int:classroom_id>/', classroom, name='classroom'),
    # ex: /exercise/5/
    path('exercise/<int:exercise_id>/', exercise, name='exercise'),
]