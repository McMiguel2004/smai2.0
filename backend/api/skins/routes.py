# backend/skins/routes.py
from flask import Blueprint, request, jsonify
import requests
from functools import wraps

skins_bp = Blueprint('skins', __name__)

@skins_bp.route('/uuid', methods=['GET'])
def get_uuid():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    
    try:
        # Realizar la solicitud a la API de Mojang a través de ashcon.app
        response = requests.get(f'https://api.ashcon.app/mojang/v2/user/{username}')
        response.raise_for_status()
        data = response.json()
        
        if 'error' in data:
            return jsonify({'error': data['error']}), 404
            
        return jsonify({'uuid': data['uuid']}), 200
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Failed to fetch UUID from Mojang API',
            'details': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500