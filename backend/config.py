import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'Servidores de Minecraft. Automatizados. Increíbles.')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'Servidores de Minecraft. Automatizados. Increíbles.')
    DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://usuario:usuario@localhost/smai')
    JWT_ALGORITHM = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 horas
    REFRESH_TOKEN_EXPIRE_DAYS = 30
    COOKIE_SECURE = os.getenv('COOKIE_SECURE', 'False').lower() == 'true'
    COOKIE_SAMESITE = os.getenv('COOKIE_SAMESITE', 'Lax')