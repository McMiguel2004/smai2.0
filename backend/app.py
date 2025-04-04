from flask import Flask
from flask_cors import CORS
from api.auth.models import db
from api.auth.routes import auth_bp
from api.skins.routes import skins_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configuración de CORS más estricta
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Authorization"],
            "supports_credentials": True,
            "max_age": 86400
        }
    })
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = Config.DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    }
    
    db.init_app(app)
    
    # Registrar blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(skins_bp, url_prefix='/api/skins')

    # Crear tablas si no existen
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)