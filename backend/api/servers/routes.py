import logging
from flask import Blueprint, request, jsonify, current_app
import requests
import os
from ..auth.models import db, User   # Asegúrate de que la ruta de importación es correcta.
from .models import Server, ServerProperties, DifficultyEnum, ModeEnum

# Configuración de logging para escribir en server_logs.txt
logging.basicConfig(
    filename='server_logs.txt', 
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Definir el blueprint para los servidores.
servers_bp = Blueprint('servers', __name__, url_prefix='/api/servers')

@servers_bp.route('/Create_Server', methods=['POST'])
def create_server():
    """
    Crea un nuevo servidor y sus propiedades.
    Primero se obtiene la información del usuario autenticado haciendo una petición interna a /api/auth/me,
    y luego se crea el registro en la base de datos usando la id obtenida.
    """
    try:
        data = request.get_json()
        current_app.logger.debug("Datos recibidos en create_server: %s", data)
        
        # Validar campos requeridos
        required_fields = ['nombreServidor', 'software', 'version']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            error_message = f"Falta(n) campo(s): {', '.join(missing_fields)}"
            current_app.logger.error(error_message)
            return jsonify({'success': False, 'message': error_message}), 400

        # Usar las cookies de la petición actual para la solicitud interna a /api/auth/me
        cookies = request.cookies
        me_url = 'http://localhost:5000/api/auth/me'
        me_response = requests.get(me_url, cookies=cookies)
        current_app.logger.debug("Respuesta del /api/auth/me: %s - %s", me_response.status_code, me_response.text)

        if me_response.status_code != 200:
            error_message = "No se pudo obtener la información del usuario"
            current_app.logger.error(error_message)
            return jsonify({'success': False, 'message': error_message}), 400

        user_data = me_response.json()
        user_id = user_data.get('id')
        current_app.logger.debug("Información del usuario obtenida: %s", user_data)

        if not user_id:
            error_message = "Información de usuario incompleta: sin id"
            current_app.logger.error(error_message)
            return jsonify({'success': False, 'message': error_message}), 400

        # Crear la instancia de Server
        new_server = Server(
            name=data.get('nombreServidor'),
            software=data.get('software'),
            version=data.get('version'),
            user_id=user_id
        )
        db.session.add(new_server)
        db.session.flush()  # Asigna el ID del servidor

        # Convertir los valores de difficulty y mode a minúsculas para asegurar coincidencia con el enum
        difficulty_value = data.get('difficulty', 'normal').lower()
        mode_value = data.get('mode', 'survival').lower()

        # Crear las propiedades del servidor
        properties = ServerProperties(
            server_id=new_server.id,
            difficulty=DifficultyEnum(difficulty_value).value,
            mode=ModeEnum(mode_value).value,
            max_players=data.get('maxPlayers', 20),
            max_build_height=data.get('maxBuildHeight', 256),
            view_distance=data.get('viewDistance', 10),
            spawn_npcs=data.get('spawnNpcs', True),
            allow_nether=data.get('allowNether', True),
            spawn_animals=data.get('spawnAnimals', True),
            spawn_monsters=data.get('spawnMonsters', True),
            pvp=data.get('pvp', True),
            enable_command_block=data.get('enableCommandBlock', False),
            allow_flight=data.get('allowFlight', False)
        )
        db.session.add(properties)
        db.session.commit()

        success_message = f"Servidor creado correctamente para el usuario con id {user_id}"
        current_app.logger.info(success_message)

        # Intentar formatear los datos del servidor
        warnings = []
        try:
            server_data = new_server.to_dict()
        except Exception as format_error:
            warning_msg = f"Servidor creado pero error al formatear los datos: {format_error}"
            current_app.logger.warning(warning_msg)
            server_data = None
            warnings.append(warning_msg)

        return jsonify({
            'success': True,
            'message': success_message,
            'server': server_data,
            'warnings': warnings
        }), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error al crear servidor")
        return jsonify({
            'success': False,
            'message': f'Error al crear servidor: {str(e)}'
        }), 500





import os
from flask import Blueprint, request, jsonify, current_app
import requests
from ..auth.models import db, User  # Asegúrate de que la ruta de importación es correcta.
from .models import Server, ServerProperties

# Definir el blueprint para los servidores.
servers_bp = Blueprint('servers', __name__, url_prefix='/api/servers')

@servers_bp.route('/show_servers', methods=['GET'])
def show_servers():
    """
    Retorna todos los servidores creados por el usuario autenticado.
    """
    try:
        cookies = request.cookies
        me_url = 'http://localhost:5000/api/auth/me'
        me_response = requests.get(me_url, cookies=cookies)
        current_app.logger.debug("Respuesta del /api/auth/me: %s - %s", me_response.status_code, me_response.text)

        if me_response.status_code != 200:
            error_message = "No se pudo obtener la información del usuario"
            current_app.logger.error(error_message)
            return jsonify({'success': False, 'message': error_message}), 400

        user_data = me_response.json()
        user_id = user_data.get('id')
        current_app.logger.debug("Información del usuario obtenida: %s", user_data)

        if not user_id:
            error_message = "Información de usuario incompleta: sin id"
            current_app.logger.error(error_message)
            return jsonify({'success': False, 'message': error_message}), 400

        user_servers = Server.query.filter_by(user_id=user_id).all()

        servers_list = []
        for server in user_servers:
            try:
                # Recolectar datos básicos: nombre, software, versión, ip_address y status
                server_data = {
                    'name': server.name,
                    'software': server.software,
                    'version': server.version,
                    'ip_address': server.ip_address if server.ip_address else None,
                    'status': server.status if server.status else None
                }
                servers_list.append(server_data)
            except Exception as e:
                current_app.logger.warning(f"Error al convertir servidor con id {server.id} a dict: {e}")
                servers_list.append({'id': server.id, 'error': 'Error al formatear los datos del servidor'})

        # 🔥 Guardar en list.txt: nombre, software, versión, ip_address y estado
        try:
            log_path = os.path.join(os.getcwd(), 'list.txt')
            with open(log_path, 'w', encoding='utf-8') as f:
                for server in servers_list:
                    # Formatear los datos para escribirlos en el archivo
                    f.write(f"Nombre: {server.get('name')}, Software: {server.get('software')}, "
                            f"Versión: {server.get('version')}, IP: {server.get('ip_address') or 'N/A'}, "
                            f"Estado: {server.get('status') or 'N/A'}\n")
            current_app.logger.debug(f"Se escribió list.txt con {len(servers_list)} servidores")
        except Exception as e:
            current_app.logger.warning(f"No se pudo escribir el archivo list.txt: {e}")

        return jsonify({
            'success': True,
            'servers': servers_list
        }), 200

    except Exception as e:
        current_app.logger.exception("Error al obtener servidores del usuario")
        return jsonify({
            'success': False,
            'message': f'Error al obtener servidores: {str(e)}'
        }), 500
