from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

def home(request):
    # return HttpResponse("Moonbase Lab Home Page!")
    return render(request, 'home.html')