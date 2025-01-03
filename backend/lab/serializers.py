from rest_framework import serializers
from .models import Classrooms, Exercises

class ClassroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classrooms
        fields = ['id', 'name', 'description', 'slug', 'created_at', 'updated_at']

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercises
        fields = ['id', 'name', 'instructions', 'output_instructions', 'code', 'slug', 'created_at', 'updated_at'] 