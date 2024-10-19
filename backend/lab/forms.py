from django import forms
from .models import Classrooms, Exercises

# class NameForm(forms.Form):
#     your_name = forms.CharField(label="Your name", max_length=100)


class ClassroomForm(forms.ModelForm):
    class Meta:
        model = Classrooms
        fields = ['name']

class ExerciseForm(forms.ModelForm):
    class Meta:
        model = Exercises
        fields = ['name']