from functools import wraps
from flask import request, jsonify
from .models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
            
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        user = User.verify_jwt(token)
        if not user:
            return jsonify({'error': 'Token is invalid or expired'}), 401
            
        return f(user, *args, **kwargs)
        
    return decorated