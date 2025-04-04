from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import jwt
from config import Config
import bcrypt
import secrets

db = SQLAlchemy()
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(255), nullable=False, default="")
    jwt = db.Column(db.String(255), nullable=False, default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    servers_created = db.Column(db.Integer, default=0)

    def set_password(self, password):
        """Genera un hash seguro de la contraseña"""
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        """Verifica si la contraseña coincide con el hash almacenado"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def generate_session_token(self):
        """Genera un token de sesión seguro"""
        self.token = secrets.token_urlsafe(32)
        return self.token

    def generate_jwt(self):
        """Genera un JWT para el usuario"""
        payload = {
            'sub': str(self.id),
            'username': self.username,
            'exp': datetime.utcnow() + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        self.jwt = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
        return self.jwt

    def invalidate_tokens(self):
        """Invalida todos los tokens del usuario"""
        self.token = ""
        self.jwt = ""

    @classmethod
    def verify_jwt(cls, token):
        """Verifica un JWT y devuelve el usuario asociado"""
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
            user = cls.query.get(int(payload['sub']))
            if user and user.jwt == token:
                return user
            return None
        except jwt.ExpiredSignatureError:
            return None
        except (jwt.InvalidTokenError, ValueError):
            return None

    @classmethod
    def verify_session_token(cls, token):
        """Verifica un token de sesión y devuelve el usuario asociado"""
        if not token:
            return None
        return cls.query.filter_by(token=token).first()

    def to_dict(self):
        """Convierte el objeto usuario a un diccionario"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'servers_created': self.servers_created
        }