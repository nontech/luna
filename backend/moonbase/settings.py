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

# Initialize environ
env = environ.Env(
    DEBUG=(bool, False),
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Environment setup
VALID_ENV_TYPES = ['local', 'docker', 'prod']
ENV_TYPE = os.getenv('ENV_TYPE', 'local')

if ENV_TYPE not in VALID_ENV_TYPES:
    raise ValueError(f"ENV_TYPE must be one of {VALID_ENV_TYPES}")

# Load environment files based on ENV_TYPE
if ENV_TYPE == 'local':
    # For local, only load local settings
    env_file = BASE_DIR / '.env.local.dev'
elif ENV_TYPE == 'docker':
    # For docker, only load docker settings
    env_file = BASE_DIR / '.env.docker.dev'
elif ENV_TYPE == 'prod':
    # For prod, only load prod settings
    env_file = BASE_DIR / '.env.prod'
else:
    raise ValueError(f"Unhandled ENV_TYPE: {ENV_TYPE}")

# Verify and load the environment file
if not env_file.exists():
    raise FileNotFoundError(
        f"Required environment file not found: {env_file}\n"
        f"This file is required for ENV_TYPE={ENV_TYPE}"
    )

# Add this line after your env_file validation
environ.Env.read_env(env_file)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

ALLOWED_HOSTS = env('DJANGO_ALLOWED_HOSTS').split()  # This will split on whitespace


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
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Lab API',
    'DESCRIPTION': 'API for managing classrooms and exercises',
    'VERSION': '1.0.0',
} 

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

# Configure CORS to allow credentials
CORS_ALLOW_ALL_ORIGINS = True  # Only for development!
# For production, specify allowed origins:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",# Your Next.js frontend
    # "http://127.0.0.1:3000",
]

LOGIN_REDIRECT_URL = 'http://localhost:3000'
LOGOUT_REDIRECT_URL = 'http://localhost:3000'

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

WSGI_APPLICATION = 'moonbase.wsgi.application'


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

# Add after your database settings
print("Current ENV_TYPE:", ENV_TYPE)
print("Database settings:")
print(f"NAME: {env('DB_NAME')}")
print(f"USER: {env('DB_USER')}")
print(f"HOST: {env('DB_HOST')}")
print(f"PORT: {env('DB_PORT')}")

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

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTHENTICATION_BACKENDS = [
    'lab.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
RESEND_SMTP_PORT = 587
RESEND_SMTP_USERNAME = 'resend'
RESEND_SMTP_HOST = 'smtp.resend.com'
RESEND_SMTP_PASSWORD = env('RESEND_API_KEY')