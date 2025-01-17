from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home, codemirror_test,
    create_new_classroom, get_classroom_details, 
    update_classroom_by_slug, delete_classroom_by_slug, 
    get_classrooms_list, create_new_exercise,
    update_exercise_by_id, delete_exercise_by_id,
    get_exercise_list, get_exercise_details,
    signup, test_email,
    get_user_details,
    login_view,
    logout_view,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views

# Initialize the router
router = DefaultRouter()

urlpatterns = [
    path('', home, name='home'),
    
    # CRUD Classroom
    path('create_new_classroom', create_new_classroom, name='create_new_classroom'),
    path('classroom/<slug:slug>/', get_classroom_details, name='get_classroom_details'),
    path('update_classroom/<slug:slug>/', update_classroom_by_slug, name='update_classroom_by_slug'),
    path('delete_classroom/<slug:slug>/', delete_classroom_by_slug, name='delete_classroom_by_slug'),

    # Classroom List
    path('classrooms', get_classrooms_list, name='get_classrooms_list'),

    # Exercise List
    path('classroom/<slug:classroom_slug>/exercises/', get_exercise_list, name='get_exercise_list'),
    
    # CRUD Exercise
    path('classroom/<slug:classroom_slug>/create_new_exercise/', create_new_exercise, name='create_new_exercise'),
    path('exercise/<uuid:exercise_id>/', get_exercise_details, name='get_exercise_details'),
    path('exercise/update/<uuid:exercise_id>/', update_exercise_by_id, name='update_exercise_by_id'),
    path('exercise/delete/<uuid:exercise_id>/', delete_exercise_by_id, name='delete_exercise_by_id'),

    # Codemirror Test
    path('codemirror-test/', codemirror_test, name='codemirror_test'),

    # API
    path('api/', include(router.urls)),

    # Signup
    path('signup/', signup, name='signup'),

    # Test Email
    path('email-test/', test_email, name='test_email'),

    # Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/', get_user_details, name='user_details'),

    # Auth URLs - put these first
    path('accounts/login/', login_view, name='login'),
    path('accounts/logout/', logout_view, name='logout'),
    
    # Include other auth URLs for password reset, etc.
    path('accounts/', include('django.contrib.auth.urls')),

    # path('api/test-cookies/', test_cookies, name='test_cookies'),
]
