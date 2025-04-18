import logging
from flask import Blueprint, request, jsonify, current_app
import requests
import os
from ..auth.models import db, User
from .models import Server, ServerProperties, DifficultyEnum, ModeEnum
import subprocess
import socket
from datetime import datetime

servers_bp = Blueprint('servers', __name__, url_prefix='/api/servers')
AUTH_ME_URL = "api/auth/me"

# Configuración de logging
logging.basicConfig(
    filename='server_logs.txt',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def get_authenticated_user_id():
    """Obtiene el ID del usuario autenticado a través de una cookie."""
    try:
        response = requests.get(f"{request.host_url}{AUTH_ME_URL}", cookies=request.cookies)
        if response.status_code == 200:
            return response.json().get('id')
    except Exception as e:
        current_app.logger.exception("Error al autenticar usuario")
    return None

# Definir el blueprint para los servidores.
servers_bp = Blueprint('servers', __name__, url_prefix='/api/servers')

@servers_bp.route('/Create_Server', methods=['POST'])
def create_server():
    """
    Crea un nuevo servidor y sus propiedades.
    Solo permite hasta 4 servidores por usuario.
    """
    try:
        data = request.get_json()
        current_app.logger.debug("Datos recibidos en create_server: %s", data)
        
        # Validar campos requeridos
        required_fields = ['nombreServidor', 'software', 'version']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({'success': False, 'message': f"Falta(n) campo(s): {', '.join(missing)}"}), 400

        # Obtener id de usuario autenticado
        me = requests.get(f"{request.host_url}api/auth/me", cookies=request.cookies)
        if me.status_code != 200:
            return jsonify({'success': False, 'message': "No se pudo obtener la información del usuario"}), 400
        uid = me.json().get('id')

        # Verificar límite
        count = Server.query.filter_by(user_id=uid).count()
        if count >= 4:
            return jsonify({'success': False, 'message': 'Se ha excedido el máximo de servidores posibles'}), 403

        # Crear servidor y propiedades
        srv = Server(name=data['nombreServidor'], software=data['software'], version=data['version'], user_id=uid)
        db.session.add(srv)
        db.session.flush()

        diff = DifficultyEnum(data.get('difficulty', 'normal').lower()).value
        mode = ModeEnum(data.get('mode', 'survival').lower()).value
        props = ServerProperties(
            server_id=srv.id,
            difficulty=diff,
            mode=mode,
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
        db.session.add(props)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Servidor creado correctamente'}), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error al crear servidor")
        return jsonify({'success': False, 'message': str(e)}), 500


@servers_bp.route('/show_servers', methods=['GET'])
def show_servers():
    """Muestra todos los servidores del usuario autenticado."""
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': "Usuario no autenticado"}), 401

        servers = Server.query.filter_by(user_id=user_id).all()
        result = [{
            'id': s.id,
            'name': s.name,
            'software': s.software,
            'version': s.version,
            'ip_address': s.ip_address,
            'port': s.port,  # <-- Añadido aquí
            'status': s.status
        } for s in servers]

        # Intentar guardar en archivo
        try:
            with open('list.txt', 'w', encoding='utf-8') as f:
                for srv in result:
                    f.write(f"Nombre: {srv['name']}, Software: {srv['software']}, Versión: {srv['version']}, IP: {srv['ip_address'] or 'N/A'}, Estado: {srv['status'] or 'N/A'}\n")
        except Exception:
            current_app.logger.warning("No se pudo escribir list.txt")

        return jsonify({'success': True, 'servers': result}), 200

    except Exception:
        current_app.logger.exception("Error al obtener servidores")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500



@servers_bp.route('/delete_server/<int:server_id>', methods=['DELETE'])
def delete_server(server_id):
    """Elimina un servidor si pertenece al usuario autenticado y su contenedor Docker."""
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': "Usuario no autenticado"}), 401

        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server:
            return jsonify({'success': False, 'message': 'Servidor no encontrado o no autorizado'}), 404

        # Guardar el ID del contenedor antes de borrar el servidor
        container_id = server.container_id

        # Eliminar de la base de datos (propiedades + servidor)
        db.session.delete(server)
        db.session.commit()

        # Detener y eliminar el contenedor Docker si existe
        if container_id:
            subprocess.run(["docker", "rm", "-f", container_id], check=False)

        # Eliminar volúmenes no utilizados (esto es general, no solo del contenedor)
        subprocess.run(["docker", "volume", "prune", "-f"], check=False)

        current_app.logger.info(f"Servidor {server_id} y contenedor {container_id} eliminados por usuario {user_id}")
        return jsonify({'success': True, 'message': 'Servidor eliminado correctamente'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error al eliminar servidor")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500






@servers_bp.route('/Start_Server/<int:server_id>', methods=['POST'])
def start_server(server_id):
    """
    Inicia (o crea y luego inicia) un contenedor Docker para el servidor indicado.
    """
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({'success': False, 'message': "Usuario no autenticado"}), 401

    # Busca el servidor y sus propiedades
    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify({'success': False, 'message': 'Servidor no encontrado o no autorizado'}), 404

    props = server.properties
    # Valores por defecto
    puerto = 25565 + server_id
    max_players      = props.max_players
    difficulty       = props.difficulty.value
    mode             = props.mode.value
    max_build_height = props.max_build_height
    view_distance    = props.view_distance
    spawn_npcs       = props.spawn_npcs
    allow_nether     = props.allow_nether
    spawn_animals    = props.spawn_animals
    spawn_monsters   = props.spawn_monsters
    pvp              = props.pvp
    enable_cmd_blk   = props.enable_command_block
    allow_flight     = props.allow_flight

    # Si no hay container_id, creamos uno nuevo
    if not server.container_id:
        cmd = [
            "sudo", "docker", "run", "-d", "-it",
            "-p", f"{puerto}:25565",
            "-e", "EULA=TRUE",
            "-e", "ONLINE_MODE=FALSE",
            "-e", "ICON=https://github.com/hammad2003/smai/blob/master/Img/MacacoSmai.png?raw=true",
            f"-e VERSION={server.version}"
        ]
        # Variables solo si difieren del valor por defecto
        if max_players != 20:       cmd += [f"-e MAX_PLAYERS={max_players}"]
        if difficulty != 'easy':    cmd += [f"-e DIFFICULTY={difficulty}"]
        if mode != 'survival':      cmd += [f"-e MODE={mode}"]
        if max_build_height != 256: cmd += [f"-e MAX_BUILD_HEIGHT={max_build_height}"]
        if view_distance != 10:     cmd += [f"-e VIEW_DISTANCE={view_distance}"]
        if not spawn_npcs:          cmd += [f"-e SPAWN_NPCS={str(spawn_npcs).lower()}"]
        if not allow_nether:        cmd += [f"-e ALLOW_NETHER={str(allow_nether).lower()}"]
        if not spawn_animals:       cmd += [f"-e SPAWN_ANIMALS={str(spawn_animals).lower()}"]
        if not spawn_monsters:      cmd += [f"-e SPAWN_MONSTERS={str(spawn_monsters).lower()}"]
        if not pvp:                 cmd += [f"-e PVP={str(pvp).lower()}"]
        if enable_cmd_blk:          cmd += [f"-e ENABLE_COMMAND_BLOCK={str(enable_cmd_blk).lower()}"]
        if allow_flight:            cmd += [f"-e ALLOW_FLIGHT={str(allow_flight).lower()}"]

        # Tipo de software
        tipo = server.software.upper()
        if tipo in ('FORGE', 'FABRIC', 'SPIGOT', 'BUKKIT'):
            cmd += [f"-e TYPE={tipo}"]

        cmd.append("itzg/minecraft-server")

        try:
            container_id = subprocess.check_output(cmd, text=True).strip()
        except subprocess.CalledProcessError as e:
            current_app.logger.error("Error al crear contenedor: %s", e)
            return jsonify({'success': False, 'message': 'Error al iniciar el servidor Docker'}), 500

        # IP del host
        ip_address = socket.gethostbyname(socket.gethostname())

        # Actualizar modelo
        server.container_id = container_id
        server.ip_address   = ip_address
        server.port         = puerto
        server.status       = 'Activo'
        server.created_at   = datetime.utcnow()
    else:
        # Si ya existe, lo arrancamos
        try:
            subprocess.check_output(["sudo", "docker", "start", server.container_id], text=True)
        except subprocess.CalledProcessError as e:
            current_app.logger.error("Error al arrancar contenedor %s: %s", server.container_id, e)
            return jsonify({'success': False, 'message': 'Error al iniciar el contenedor Docker'}), 500

        server.status = 'Activo'

    db.session.commit()
    current_app.logger.info("Servidor %s iniciado por usuario %s", server_id, user_id)
    return jsonify({'success': True, 'message': 'Servidor iniciado correctamente'}), 200
