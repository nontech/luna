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
    get_tests_list,
    create_new_test,
    get_test_details,
    update_test_by_id,
    delete_test_by_id,
    join_classroom,
    leave_classroom,
    create_submission,
    update_submission,
    get_submission_details,
    get_all_submissions,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views

# Initialize the router
router = DefaultRouter()

urlpatterns = [
    path('', home, name='home'),
    
   # Lists

   # Classroom List
    path('classrooms', get_classrooms_list, name='get_classrooms_list'),

    # Exercise List
    path('classroom/<slug:classroom_slug>/exercises/', get_exercise_list, name='get_exercise_list'),

    # Test List
    path('exercise/<uuid:exercise_id>/tests/', get_tests_list, name='get_tests_list'),

    # Submission List
    path('exercise/<uuid:exercise_id>/submissions/', get_all_submissions, name='get_all_submissions'),
   
    
    # Classroom CRUD

    # Create
    path('create_new_classroom', create_new_classroom, name='create_new_classroom'),
    # Read
    path('classroom/<slug:slug>/', get_classroom_details, name='get_classroom_details'),
    # Update
    path('update_classroom/<slug:slug>/', update_classroom_by_slug, name='update_classroom_by_slug'),
    # Delete
    path('delete_classroom/<slug:slug>/', delete_classroom_by_slug, name='delete_classroom_by_slug'),

    
    
    # Exercise CRUD
    
    # Create
    path('classroom/<slug:classroom_slug>/create_new_exercise/', create_new_exercise, name='create_new_exercise'),
    # Read
    path('exercise/<uuid:exercise_id>/', get_exercise_details, name='get_exercise_details'),
    # Update
    path('exercise/update/<uuid:exercise_id>/', update_exercise_by_id, name='update_exercise_by_id'),
    # Delete
    path('exercise/delete/<uuid:exercise_id>/', delete_exercise_by_id, name='delete_exercise_by_id'),

    # Classroom Membership
    path('classroom/<slug:slug>/join/', join_classroom, name='join_classroom'),
    path('classroom/<slug:slug>/leave/', leave_classroom, name='leave_classroom'),

    # Test CRUD

    # Create
    path('exercise/<uuid:exercise_id>/create_new_test/', create_new_test, name='create_new_test'),
    # Read
    path('test/<uuid:test_id>/', get_test_details, name='get_test_details'),
    # Update
    path('test/update/<uuid:test_id>/', update_test_by_id, name='update_test_by_id'),
    # Delete
    path('test/delete/<uuid:test_id>/', delete_test_by_id, name='delete_test_by_id'),

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

    # Submission endpoints

    # Create
    path('exercise/<uuid:exercise_id>/submission/create/', create_submission, name='create_submission'),
    # Read
    path('exercise/<uuid:exercise_id>/submission/', get_submission_details, name='get_submission_details'),
    # Update
    path('submission/<uuid:submission_id>/update/', update_submission, name='update_submission'),
]
