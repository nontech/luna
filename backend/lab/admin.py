from django.contrib import admin

# Register your models here.
from .models import Users, Classrooms, ClassroomUsers, Exercises, Tests, ClassroomExercises, UserExercises

admin.site.register(Users)
admin.site.register(Classrooms)
admin.site.register(ClassroomUsers)
admin.site.register(Exercises)
admin.site.register(Tests)
admin.site.register(ClassroomExercises)
admin.site.register(UserExercises)
