"""
Django settings for moonbase project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import environ
import os
from datetime import timedelta
import dj_database_url
import logging

# Initialize environ
env = environ.Env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Environment setup
VALID_ENV_TYPES = ['local', 'docker', 'prod']
# Standard Python os.getenv():
ENV_TYPE = os.getenv('ENV_TYPE', 'local')

if ENV_TYPE not in VALID_ENV_TYPES:
    raise ValueError(f"ENV_TYPE must be one of {VALID_ENV_TYPES}")

# Load environment files only in non-production environments
if ENV_TYPE != 'prod':
    # Load environment files based on ENV_TYPE
    if ENV_TYPE == 'local':
        env_file = BASE_DIR / '.env.local.dev'
    elif ENV_TYPE == 'docker':
        env_file = BASE_DIR / '.env.docker.dev'
    
    # Verify and load the environment file for local development
    if not env_file.exists():
        raise FileNotFoundError(
            f"Required environment file not found: {env_file}\n"
            f"This file is required for ENV_TYPE={ENV_TYPE}"
        )
    
    # Read the env file
    environ.Env.read_env(env_file)
else:
    # In production, use environment variables directly
    # No need to load any .env file
    pass

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Make sure to generate a strong SECRET_KEY for production
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
if ENV_TYPE == 'local':
    DEBUG = True
else:
    DEBUG = False

# Controls which host/domain names Django site can serve
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'luna-backend.up.railway.app']


# Controls which origins can make POST/PUT/DELETE requests with CSRF tokens
# Important for forms and POST requests from frontend
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "https://luna-backend.up.railway.app",
]
# Related CSRF settings
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = True


# Controls which origins can make CORS requests to your API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",    # Local frontend development
]
CORS_ALLOW_CREDENTIALS = True  # Important for cookies
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Redirects
LOGIN_REDIRECT_URL = 'http://localhost:3000'
LOGOUT_REDIRECT_URL = 'http://localhost:3000'

# Application definition

INSTALLED_APPS = [
    'lab.apps.LabConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'drf_spectacular',
    'rest_framework_simplejwt',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'lab.authentication.CookieJWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Lab API',
    'DESCRIPTION': 'API for managing classrooms and exercises',
    'VERSION': '1.0.0',
} 

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Add this setting to determine if we're in development
IS_DEVELOPMENT = ENV_TYPE == 'local'

# JWT settings
SIMPLE_JWT = {
    # Cookie settings
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_REFRESH': 'refresh_token',
    'AUTH_COOKIE_SECURE': env.bool('AUTH_COOKIE_SECURE', default=True),
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_SAMESITE': 'Lax',
    'AUTH_COOKIE_PATH': '/',
    
    # Token lifetime
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),

    # User identification
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}


ROOT_URLCONF = 'moonbase.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION = 'moonbase.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}


# If prod, use DATABASE_URL from Railway
# if ENV_TYPE == 'prod':
#     DATABASES['default'] = dj_database_url.parse(env('DATABASE_URL'))

# Add after your database settings
print("Current ENV_TYPE:", ENV_TYPE)
print("DATABASES:", DATABASES)
# print("Database settings:")
# print(f"NAME: {env('DB_NAME')}")
# print(f"USER: {env('DB_USER')}")
# print(f"HOST: {env('DB_HOST')}")
# print(f"PORT: {env('DB_PORT')}")

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# URL prefix for serving static files
# If STATIC_URL = 'static/', a file at `myapp/static/myapp/image.jpg` will be served at `http://example.com/static/myapp/image.jpg`
STATIC_URL = 'static/'

# Production-only setting - this is where Whitenoise will serve files from
# Contains all static files from all apps combined into one directory
# Where 'python manage.py collectstatic' will gather all static files
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Only use STATICFILES_DIRS in development
if ENV_TYPE != 'prod':
    # Additional locations where Django will look for static files
    # For project-level static files (not belonging to any specific app)
    # Your source static files go here or in your app's static directory
    STATICFILES_DIRS = [BASE_DIR / "static"]

# Add Whitenoise storage for compression (optional but recommended)
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTHENTICATION_BACKENDS = [
    'lab.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' if ENV_TYPE == 'prod' else 'django.core.mail.backends.console.EmailBackend'
RESEND_SMTP_PORT = 587
RESEND_SMTP_USERNAME = 'resend'
RESEND_SMTP_HOST = 'smtp.resend.com'
if os.environ.get('COLLECTING_STATIC', '0') != '1':
    RESEND_SMTP_PASSWORD = env('RESEND_API_KEY', default=None)
    if RESEND_SMTP_PASSWORD is None and ENV_TYPE == 'prod':
        EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'



# Update Session settings
SESSION_COOKIE_SECURE = ENV_TYPE == 'prod'
SESSION_COOKIE_SAMESITE = 'Lax'

# Add these logging settings
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}

# Security Settings for Production
if ENV_TYPE == 'prod':
    # Update JWT cookie settings for production
    SIMPLE_JWT['AUTH_COOKIE_SECURE'] = True
    SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'Lax'
    # Security settings
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
