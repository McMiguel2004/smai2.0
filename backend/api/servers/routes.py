import logging
from flask import Blueprint, request, jsonify, current_app
import requests
import os
from ..auth.models import db, User
from .models import Server, ServerProperties, DifficultyEnum, ModeEnum
import subprocess
import socket
from datetime import datetime
from flask import Response, stream_with_context

import pathlib
from werkzeug.utils import secure_filename



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
            'container_id': s.container_id,  # <-- añadir container_id aquí

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
            subprocess.run(["sudo", "docker", "rm", "-f", container_id], check=False)

        # Eliminar volúmenes no utilizados (esto es general, no solo del contenedor)
        subprocess.run(["sudo", "docker", "volume", "prune", "-f"], check=False)

        current_app.logger.info(f"Servidor {server_id} y contenedor {container_id} eliminados por usuario {user_id}")
        return jsonify({'success': True, 'message': 'Servidor eliminado correctamente'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error al eliminar servidor")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500


@servers_bp.route('/Start_Server/<int:server_id>', methods=['POST'])
def start_server(server_id):
    """
    Inicia (o crea y luego inicia) un contenedor Docker para el servidor indicado,
    incluyendo el -e TYPE según el software elegido por el usuario.
    """
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({'success': False, 'message': "Usuario no autenticado"}), 401

    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify({'success': False, 'message': 'Servidor no encontrado o no autorizado'}), 404

    props = server.properties
    puerto = 25565 + server_id

    # Mapeo software -> TYPE
    type_map = {
        'java':   None,
        'forge':  'FORGE',
        'fabric': 'FABRIC',
        'spigot': 'SPIGOT',
        'bukkit': 'BUKKIT',
    }
    sof = server.software.strip().lower()
    type_env = type_map.get(sof, None)

    # Construimos el cmd base
    cmd = [
        "sudo", "docker", "run", "-d", "-it",
        "-p", f"{puerto}:25565",
        "-e", "EULA=TRUE",
        "-e", "ONLINE_MODE=FALSE",
        "-e", "ICON=https://github.com/hammad2003/smai/blob/master/Img/MacacoSmai.png?raw=true",
        "-e", f"VERSION={server.version}"
    ]

    # Props avanzadas solo si difieren de defecto
    if props.max_players      != 20:       cmd += ["-e", f"MAX_PLAYERS={props.max_players}"]
    if props.difficulty.value != 'easy':   cmd += ["-e", f"DIFFICULTY={props.difficulty.value}"]
    if props.mode.value       != 'survival':cmd += ["-e", f"MODE={props.mode.value}"]
    if props.max_build_height != 256:      cmd += ["-e", f"MAX_BUILD_HEIGHT={props.max_build_height}"]
    if props.view_distance    != 10:       cmd += ["-e", f"VIEW_DISTANCE={props.view_distance}"]
    if not props.spawn_npcs:               cmd += ["-e", f"SPAWN_NPCS={str(props.spawn_npcs).lower()}"]
    if not props.allow_nether:             cmd += ["-e", f"ALLOW_NETHER={str(props.allow_nether).lower()}"]
    if not props.spawn_animals:            cmd += ["-e", f"SPAWN_ANIMALS={str(props.spawn_animals).lower()}"]
    if not props.spawn_monsters:           cmd += ["-e", f"SPAWN_MONSTERS={str(props.spawn_monsters).lower()}"]
    if not props.pvp:                      cmd += ["-e", f"PVP={str(props.pvp).lower()}"]
    if props.enable_command_block:         cmd += ["-e", f"ENABLE_COMMAND_BLOCK={str(props.enable_command_block).lower()}"]
    if props.allow_flight:                 cmd += ["-e", f"ALLOW_FLIGHT={str(props.allow_flight).lower()}"]

    # Añadimos TYPE si aplica
    if type_env:
        cmd += ["-e", f"TYPE={type_env}"]

    # Finalmente la imagen
    cmd.append("itzg/minecraft-server")

    try:
        if not server.container_id:
            # Crear contenedor
            container_id = subprocess.check_output(cmd, text=True).strip()
            server.container_id = container_id
            server.ip_address   = socket.gethostbyname(socket.gethostname())
            server.port         = puerto
            server.status       = 'Activo'
            server.created_at   = datetime.utcnow()
        else:
            # Solo arrancar
            subprocess.check_output(["sudo", "docker", "start", server.container_id], text=True)
            server.status = 'Activo'

        db.session.commit()
        current_app.logger.info("Servidor %s iniciado por usuario %s", server_id, user_id)
        return jsonify({'success': True, 'message': 'Servidor iniciado correctamente'}), 200

    except subprocess.CalledProcessError as e:
        current_app.logger.error("Error al iniciar contenedor Docker: %s", e)
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error al iniciar el servidor Docker'}), 500




@servers_bp.route('/stop_server/<int:server_id>', methods=['POST'])
def stop_server(server_id):
    """
    Detiene un contenedor Docker asociado al servidor y actualiza su estado.
    """
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Usuario no autenticado'}), 401

        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server or not server.container_id:
            return jsonify({'success': False, 'message': 'Servidor no encontrado o sin contenedor'}), 404

        # Usar sudo para detener el contenedor (sudoers permite sin contraseña)
        subprocess.run(['sudo', 'docker', 'stop', server.container_id], check=False)

        server.status = 'Detenido'
        db.session.commit()

        current_app.logger.info(f"Servidor {server_id} detenido por usuario {user_id}")
        return jsonify({'success': True, 'message': 'Servidor detenido correctamente'}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception('Error al detener servidor')
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500




@servers_bp.route('/restart_server/<int:server_id>', methods=['POST'])
def restart_server(server_id):
    """
    Reinicia un contenedor Docker asociado al servidor.
    """
    try:
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Usuario no autenticado'}), 401

        server = Server.query.filter_by(id=server_id, user_id=user_id).first()
        if not server:
            return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404

        if server.container_id:
            subprocess.run(['sudo', 'docker', 'restart', server.container_id], check=False)

        current_app.logger.info(f"Servidor {server_id} reiniciado por usuario {user_id}")
        return jsonify({'success': True, 'message': 'Servidor reiniciado correctamente'}), 200

    except Exception as e:
        current_app.logger.exception("Error al reiniciar servidor")
        return jsonify({'success': False, 'message': 'Error interno del servidor'}), 500






@servers_bp.route('/server_terminal/<int:server_id>')
def server_terminal(server_id):
    """
    Emite en tiempo real las nuevas líneas del archivo latest.log del servidor.
    """

    # 1. Verificar autenticación
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({'success': False, 'message': 'Usuario no autenticado'}), 401

    # 2. Verificar si el servidor existe y pertenece al usuario
    server = Server.query.filter_by(id=server_id, user_id=user_id).first()
    if not server:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404

    # 3. Verificar que el servidor tenga contenedor Docker asignado
    if not server.container_id:
        return jsonify({'success': False, 'message': 'Contenedor no asociado al servidor'}), 400

    # 4. Función generadora de eventos SSE
    def generate():
        cmd = [
            'sudo', 'docker', 'exec', server.container_id,
            'tail', '-n', '50', '-f', '/data/logs/latest.log'
        ]
        proc = None
        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            for line in iter(proc.stdout.readline, ''):
                yield f"data: {line.rstrip()}\n\n"
        except Exception as e:
            current_app.logger.exception("Error leyendo logs con tail -f")
            yield f"data: ERROR: {str(e)}\n\n"
        finally:
            if proc:
                proc.terminate()

    # 5. Respuesta en formato Server-Sent Events
    return Response(stream_with_context(generate()), mimetype='text/event-stream')



@servers_bp.route('/upfile', methods=['POST'])
def upload_file():
    """
    Recibe un archivo y un servidorId, lo guarda temporalmente en disco,
    lo copia al contenedor Docker correspondiente y lo borra del host.
    """
    try:
        # 1. Autenticación
        user_id = get_authenticated_user_id()
        if not user_id:
            return jsonify({'success': False, 'message': 'Usuario no autenticado'}), 401

        # 2. Obtener archivo y servidorId
        if 'archivo' not in request.files or 'servidorId' not in request.form:
            return jsonify({'success': False, 'message': 'Datos incompletos'}), 400

        archivo = request.files['archivo']
        servidor_id = int(request.form['servidorId'])

        # 3. Validar nombre
        if archivo.filename == '':
            return jsonify({'success': False, 'message': 'No se ha seleccionado ningún archivo'}), 400

        # 4. Buscar servidor en BD
        server = Server.query.filter_by(id=servidor_id, user_id=user_id).first()
        if not server or not server.container_id:
            return jsonify({'success': False, 'message': 'Servidor no encontrado o sin contenedor'}), 404

        software = server.software.lower()

        # 5. Directorios según software (locales dentro de backend/)
        base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        if software in ('forge', 'fabric'):
            host_dir = os.path.join(base, 'mods')
            cont_dir = '/data/mods'
        elif software in ('spigot', 'bukkit'):
            host_dir = os.path.join(base, 'plugins')
            cont_dir = '/data/plugins'
        else:
            return jsonify({'success': False, 'message': 'Software no compatible'}), 400

        # 6. Crear directorio si no existe
        pathlib.Path(host_dir).mkdir(parents=True, exist_ok=True)

        # 7. Guardar archivo en host
        filename = secure_filename(archivo.filename)
        host_path = os.path.join(host_dir, filename)
        archivo.save(host_path)

        # 8. Copiar al contenedor Docker
        cmd = [
            'sudo', 'docker', 'cp',
            host_path,
            f"{server.container_id}:{cont_dir}/{filename}"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)

        # 9. Borrar fichero temporario
        os.remove(host_path)

        if result.returncode != 0:
            current_app.logger.error("Docker cp error: %s", result.stderr.strip())
            return jsonify({
                'success': False,
                'message': 'Error al enviar al contenedor: ' + result.stderr.strip()
            }), 500

        return jsonify({
            'success': True,
            'message': 'Archivo subido correctamente. Reinicia el servidor para aplicar cambios.'
        }), 200

    except Exception as e:
        current_app.logger.exception("Error en /upfile")
        return jsonify({'success': False, 'message': str(e)}), 500
