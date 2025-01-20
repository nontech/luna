from django.db import models
from django.utils.text import slugify
import uuid 
from django.contrib.auth.models import User

# Create your models here.
from django.db import models

class Classrooms(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(
        max_length=100,
        unique=True,
        db_index=True,
        blank=True
    )
    description = models.TextField()
    creator_user = models.ForeignKey(User, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classrooms'  # This overrides the default 'lab_classrooms' table name in the database
        verbose_name = 'Classroom'  # This overrides the default singular name 'Classrooms' for the model in Admin panel
        verbose_name_plural = 'Classrooms'  # This overrides the default plural name 'Classroomss' for the model in Admin panel

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    

class ClassroomUsers(models.Model):
    classroom = models.ForeignKey(Classrooms, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classroom_users'  # This overrides the default 'lab_classroomusers' table name in the database
        verbose_name = 'Classroom User'  # This overrides the default singular name 'ClassroomUsers' for the model in Admin panel
        verbose_name_plural = 'Classroom Users'  # This overrides the default plural name 'ClassroomUserss' for the model in Admin panel

class Exercises(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=100, blank=True)
    creator_user = models.ForeignKey(User, on_delete=models.CASCADE)
    instructions = models.TextField()
    code = models.TextField()

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exercises' # This overrides the default 'lab_exercises' table name in the database
        verbose_name = 'Exercise' # This overrides the default singular name 'Exercises' for the model in Admin panel
        verbose_name_plural = 'Exercises' # This overrides the default plural name 'Exercisess' for the model in Admin panel

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tests(models.Model):
    category = models.CharField(max_length=50)
    test_feedback = models.TextField(default='')

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tests'  # This overrides the default 'lab_tests' table name in the database
        verbose_name = 'Test'  # This overrides the default singular name 'Tests' for the model in Admin panel
        verbose_name_plural = 'Tests'  # This overrides the default plural name 'Testss' for the model in Admin panel


class ClassroomExercises(models.Model):
    classroom = models.ForeignKey(Classrooms, on_delete=models.CASCADE)
    exercise = models.ForeignKey(
        Exercises, 
        on_delete=models.CASCADE,
        to_field='id'  # Explicitly specify the UUID field
    )

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classroom_exercises'  # This overrides the default 'lab_classroomexercises' table name in the database
        verbose_name = 'Classroom Exercise' # This overrides the default singular name 'ClassroomExercises' for the model in Admin panel
        verbose_name_plural = 'Classroom Exercises' # This overrides the default plural name 'ClassroomExercisess' for the model in Admin panel

class ExerciseTests(models.Model):
    exercise = models.ForeignKey(
        Exercises, 
        on_delete=models.CASCADE,
        to_field='id'  # Explicitly specify the UUID field
    )
    test = models.ForeignKey(Tests, on_delete=models.CASCADE)

    # timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exercise_tests'  # This overrides the default 'lab_exercisetests' table name in the database
        verbose_name = 'Exercise Test' # This overrides the default singular name 'ExerciseTests' for the model in Admin panel
        verbose_name_plural = 'Exercise Tests' # This overrides the default plural name 'ExerciseTestss' for the model in Admin panel

class Submissions(models.Model):
    STATUS_CHOICES = [
        ('assigned_to_student', 'Assigned to Student'),
        ('submitted_by_student', 'Submitted by Student'),
        ('reviewed_by_teacher', 'Reviewed by Teacher')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    exercise = models.ForeignKey(Exercises, on_delete=models.CASCADE, related_name='submissions')
    due_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='assigned_to_student')
    feedback = models.TextField(blank=True)
    submitted_code = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'submissions'  # This overrides the default 'lab_submissions' table name in the database
        verbose_name = 'Submission' # This overrides the default singular name 'Submissions' for the model in Admin panel
        verbose_name_plural = 'Submissions' # This overrides the default plural name 'Submissionss' for the model in Admin panel
        unique_together = ['student', 'exercise']

    def __str__(self):
        return f"{self.student.username} - {self.exercise.name}"