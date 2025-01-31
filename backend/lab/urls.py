from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    home,create_new_classroom, get_classroom_details, 
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
    # Core Pages
    path('', home, name='home'),
    
    # Authentication
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/', include('django.contrib.auth.urls')),  # Django auth URLs (password reset, etc.)
    
    # User
    path('api/users/me/', get_user_details),
    
    # Classrooms
    path('api/classrooms/', get_classrooms_list),
    path('api/classrooms/create/', create_new_classroom),
    path('api/classrooms/<slug:slug>/', get_classroom_details),
    path('api/classrooms/<slug:slug>/update/', update_classroom_by_slug),
    path('api/classrooms/<slug:slug>/delete/', delete_classroom_by_slug),
    path('api/classrooms/<slug:slug>/join/', join_classroom),
    path('api/classrooms/<slug:slug>/leave/', leave_classroom),
    
    # Exercises (nested under classrooms)
    path('api/classrooms/<slug:classroom_slug>/exercises/', get_exercise_list),
    path('api/classrooms/<slug:classroom_slug>/exercises/create/', create_new_exercise),
    path('api/exercises/<uuid:exercise_id>/', get_exercise_details),
    path('api/exercises/<uuid:exercise_id>/update/', update_exercise_by_id),
    path('api/exercises/<uuid:exercise_id>/delete/', delete_exercise_by_id),
    
    # Tests (nested under exercises)
    path('api/exercises/<uuid:exercise_id>/tests/', get_tests_list),
    path('api/exercises/<uuid:exercise_id>/tests/create/', create_new_test),
    path('api/tests/<uuid:test_id>/', get_test_details),
    path('api/tests/<uuid:test_id>/update/', update_test_by_id),
    path('api/tests/<uuid:test_id>/delete/', delete_test_by_id),
    
    # Submissions (nested under exercises)
    path('api/exercises/<uuid:exercise_id>/submissions/', get_all_submissions),
    path('api/exercises/<uuid:exercise_id>/submissions/create/', create_submission),
    path('api/exercises/<uuid:exercise_id>/submission/', get_submission_details),
    path('api/submissions/<uuid:submission_id>/update/', update_submission),
    
    # Development/Testing
    path('dev/email-test/', test_email),
    
    # DRF API root
    path('api/', include(router.urls)),
]
