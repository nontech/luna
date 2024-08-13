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
        db_table = 'users'  # This overrides the default 'lab_users' table name in the database
        verbose_name = 'User' # This overrides the default singular name 'Users' for the model in Admin panel
        verbose_name_plural = 'Users' # This overrides the default plural name 'Userss' for the model in Admin panel

    def __str__(self):
        return self.full_name
    

class Classrooms(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    creator_user = models.ForeignKey(Users, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classrooms'  # This overrides the default 'lab_classrooms' table name in the database
        verbose_name = 'Classroom'  # This overrides the default singular name 'Classrooms' for the model in Admin panel
        verbose_name_plural = 'Classrooms'  # This overrides the default plural name 'Classroomss' for the model in Admin panel

    def __str__(self):
        return self.name
    

class ClassroomUsers(models.Model):
    classroom = models.ForeignKey(Classrooms, on_delete=models.CASCADE)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classroom_users'  # This overrides the default 'lab_classroomusers' table name in the database
        verbose_name = 'Classroom User'  # This overrides the default singular name 'ClassroomUsers' for the model in Admin panel
        verbose_name_plural = 'Classroom Users'  # This overrides the default plural name 'ClassroomUserss' for the model in Admin panel

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
        db_table = 'exercises'  # This overrides the default 'lab_exercises' table name in the database
        verbose_name = 'Exercise'  # This overrides the default singular name 'Exercises' for the model in Admin panel
        verbose_name_plural = 'Exercises' # This overrides the default plural name 'Exercisess' for the model in Admin panel

    def __str__(self):
        return self.name


class Tests(models.Model):
    category = models.CharField(max_length=50)
    output = models.CharField(max_length=50)
    exercise = models.OneToOneField(Exercises, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tests'  # This overrides the default 'lab_tests' table name in the database
        verbose_name = 'Test'  # This overrides the default singular name 'Tests' for the model in Admin panel
        verbose_name_plural = 'Tests'  # This overrides the default plural name 'Testss' for the model in Admin panel


class ClassroomExercises(models.Model):
    classroom = models.ForeignKey(Classrooms, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercises, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classroom_exercises'  # This overrides the default 'lab_classroomexercises' table name in the database
        verbose_name = 'Classroom Exercise' # This overrides the default singular name 'ClassroomExercises' for the model in Admin panel
        verbose_name_plural = 'Classroom Exercises' # This overrides the default plural name 'ClassroomExercisess' for the model in Admin panel


class UserExercises(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercises, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    feedback = models.TextField()

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_exercises'  # This overrides the default 'lab_userexercises' table name in the database
        verbose_name = 'User Exercise' # This overrides the default singular name 'UserExercises' for the model in Admin panel
        verbose_name_plural = 'User Exercises' # This overrides the default plural name 'UserExercisess' for the model in Admin panel
