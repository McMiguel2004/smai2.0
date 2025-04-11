from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from ..servers.models import Server
from ..auth.models import User

def server_owner_required(f):
    @wraps(f)
    def decorated_function(server_id, *args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        
        server = Server.query.filter_by(
            id=server_id, 
            user_id=current_user_id
        ).first()
        
        if not server:
            return jsonify({
                'success': False, 
                'message': 'Servidor no encontrado o no autorizado'
            }), 404
            
        return f(server_id, *args, **kwargs)
    return decorated_function