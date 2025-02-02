import os
from .settings import *
from .settings import BASE_DIR
import dj_database_url 

ALLOWED_HOSTS = [os.environ['RENDER_EXTERNAL_HOSTNAME']]
CSRF_TRUSTED_ORIGINS = ['HTTPS://'+ os.environ['RENDER_EXTERNAL_HOSTNAME']]

DEBUG = False
SECRET_KEY = os.environ['SECRET_KEY']


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]


CORS_ALLOWED_ORIGINS = [
    # "http://localhost:3000",  
    # "http://127.0.0.1:3000",
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


DATABASES = {
    'default': dj_database_url.config(
        default=os.environ["DATABASE_URL"],
        conn_max_age=600
    )
}

STATIC_ROOT =  BASE_DIR / 'staticfiles'


