from django.db import models

# Create your models here.
from django.db import models

class Users(models.Model):
    full_name = models.CharField(max_length=50)
    username = models.CharField(max_length=50)
    email = models.EmailField()
    password = models.CharField(max_length=50)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'  # This overrides the default table name

class Classrooms(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    creator_user = models.ForeignKey(Users, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classrooms'  # This overrides the default table name

class ClassroomUsers(models.Model):
    classroom = models.ForeignKey(Classrooms, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classroom_users'  # This overrides the default table name

class Exercises(models.Model):
    name = models.CharField(max_length=50)
    instructions = models.TextField()
    output_instructions = models.TextField()
    code = models.TextField()
    creator_user = models.ForeignKey(Users, on_delete=models.CASCADE)
    test = models.OneToOneField('Tests', on_delete=models.CASCADE, null=True, blank=True)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exercises'  # This overrides the default table name

class Tests(models.Model):
    category = models.CharField(max_length=50)
    output = models.CharField(max_length=50)
    exercise = models.OneToOneField(Exercises, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tests'  # This overrides the default table name

class ClassroomExercises(models.Model):
    classroom = models.ForeignKey(Classrooms, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercises, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classroom_exercises'  # This overrides the default table name

class UserExercises(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercises, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    feedback = models.TextField()

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_exercises'  # This overrides the default table name
