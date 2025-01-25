from django.contrib import admin

# Register your models here.
from .models import Classrooms, ClassroomUsers, Exercises, Tests, ClassroomExercises, Submissions, ExerciseTests

admin.site.register(Classrooms)
admin.site.register(ClassroomUsers)
admin.site.register(Exercises)
admin.site.register(Tests)
admin.site.register(ClassroomExercises)
admin.site.register(Submissions)
admin.site.register(ExerciseTests)