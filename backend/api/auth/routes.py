from flask import Blueprint, request, jsonify, make_response
from .models import User
from .models import db, User
from datetime import datetime, timedelta
from config import Config
import re
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# Expresiones regulares para validación
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
USERNAME_REGEX = re.compile(r'^[a-zA-Z0-9_]{3,20}$')
PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Primero, intenta obtener el token del header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        # Si no hay token en el header, intenta obtenerlo de la cookie "access_token"
        if not token:
            cookie_token = request.cookies.get('access_token')
            if cookie_token:
                if cookie_token.startswith('Bearer '):
                    token = cookie_token.split(" ")[1]
                else:
                    token = cookie_token
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        user = User.verify_jwt(token)
        if not user:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        return f(user, *args, **kwargs)
    return decorated

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validación de campos
    if not data or not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
        
    username = data['username'].strip()
    email = data['email'].strip().lower()
    password = data['password']
    
    # Validaciones
    if not USERNAME_REGEX.match(username):
        return jsonify({'error': 'Invalid username format'}), 400
        
    if not EMAIL_REGEX.match(email):
        return jsonify({'error': 'Invalid email format'}), 400
        
    if not PASSWORD_REGEX.match(password):
        return jsonify({'error': 'Password must be at least 8 characters with letters and numbers'}), 400
        
    # Verificar unicidad
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
        
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 409
        
    try:
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing email or password'}), 400
        
    email = data['email'].strip().lower()
    password = data['password']
    
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    try:
        # Generar tokens
        session_token = user.generate_session_token()
        jwt_token = user.generate_jwt()
        
        db.session.commit()
        
        # Crear respuesta
        response = jsonify({
            'message': 'Logged in successfully',
            'user': user.to_dict(),
            'access_token': jwt_token,
            'refresh_token': session_token
        })
        
        # Configurar cookies seguras
        response.set_cookie(
            'access_token',
            f'Bearer {jwt_token}',
            httponly=True,   # Mantener HttpOnly para seguridad
            #secure=Config.COOKIE_SECURE,
                secure=False,
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        response.set_cookie(
            'refresh_token',
            session_token,
            httponly=True,
            #secure=Config.COOKIE_SECURE,
                secure=False,
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
        
        return response
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    refresh_token = request.cookies.get('refresh_token')
    
    if not refresh_token:
        return jsonify({'error': 'Refresh token is missing'}), 401
        
    user = User.verify_session_token(refresh_token)
    if not user:
        return jsonify({'error': 'Invalid refresh token'}), 401
        
    try:
        # Generar nuevos tokens
        new_jwt = user.generate_jwt()
        new_refresh = user.generate_session_token()
        
        db.session.commit()
        
        # Crear respuesta
        response = jsonify({
            'message': 'Token refreshed successfully',
            'access_token': new_jwt,
            'refresh_token': new_refresh
        })
        
        # Actualizar cookies
        response.set_cookie(
            'access_token',
            f'Bearer {new_jwt}',
            httponly=True,
            secure=Config.COOKIE_SECURE,
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
        response.set_cookie(
            'refresh_token',
            new_refresh,
            httponly=True,
            secure=Config.COOKIE_SECURE,
            samesite=Config.COOKIE_SAMESITE,
            max_age=Config.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        )
        
        return response
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    try:
        # Invalidar tokens
        current_user.invalidate_tokens()
        db.session.commit()

        # Crear respuesta
        response = jsonify({'message': 'Successfully logged out'})

        # Eliminar cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify(current_user.to_dict())
