from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Use filter().first() instead of get() to handle multiple users case
            user = UserModel.objects.filter(email=username).first()
            if user and user.check_password(password):
                return user
        except Exception as e:
            # Log any unexpected errors
            print(f"Authentication error: {str(e)}")
            return None
        return None 