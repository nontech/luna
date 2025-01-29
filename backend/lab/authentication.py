from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings
import logging
from drf_spectacular.extensions import OpenApiAuthenticationExtension

logger = logging.getLogger(__name__)

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        logger.info("Cookies: %s", request.COOKIES.keys())
        
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        
        if not raw_token:
            logger.warning("No access_token cookie found")
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            logger.info("Auth successful: %s", user.username)
            return user, validated_token
        except TokenError as e:
            logger.error("Token error: %s", str(e))
            return None
        except Exception as e:
            logger.error("Auth error: %s", str(e))
            return None

class CookieJWTAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = 'lab.authentication.CookieJWTAuthentication'
    name = 'Cookie JWT'
    
    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'cookie',
            'name': settings.SIMPLE_JWT['AUTH_COOKIE'],
            'description': 'JWT authentication using cookies'
        } 