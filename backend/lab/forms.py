from django import forms
from .models import Classrooms, Exercises
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group

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

class EmailSignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)
    username = forms.CharField(widget=forms.HiddenInput(), required=False)
    
    # Define choices as a class variable
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    ]
    
    role = forms.ChoiceField(
        widget=forms.RadioSelect,
        choices=ROLE_CHOICES,
        label='I am a'
    )

    class Meta(UserCreationForm.Meta):
        fields = ('email', 'password1', 'password2', 'role')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].help_text = None
        self.fields['email'].help_text = "We'll use this for your login"
        
        # Style input fields
        input_classes = "input input-bordered w-full"
        self.fields['email'].widget.attrs.update({
            'class': input_classes,
            'placeholder': 'Enter your email'
        })
        self.fields['password1'].widget.attrs.update({
            'class': input_classes,
            'placeholder': 'Enter your password'
        })
        self.fields['password2'].widget.attrs.update({
            'class': input_classes,
            'placeholder': 'Confirm your password'
        })
        self.fields['role'].widget.attrs.update({
            'class': "radio radio-primary mr-2"
        })
        self.fields['role'].widget.attrs['class_container'] = "flex gap-6 mt-2"

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        
        if email:
            # Generate username from email
            username = email.split('@')[0]
            base_username = username
            counter = 1
            
            # Ensure unique username
            while self._meta.model.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Set both the form field and cleaned_data
            self.instance.username = username  # Set it on the instance
            cleaned_data['username'] = username
        
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        # Ensure username and email are set
        user.username = self.cleaned_data['username']
        user.email = self.cleaned_data['email']
        
        if commit:
            user.save()
            # Assign user to appropriate group based on role
            role = self.cleaned_data['role']
            group_name = 'Teachers' if role == 'teacher' else 'Students'
            group = Group.objects.get(name=group_name)
            user.groups.add(group)
        return user