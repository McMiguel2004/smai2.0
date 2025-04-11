import os
import subprocess
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Server, ServerProperties, db, DifficultyEnum, ModeEnum
from werkzeug.utils import secure_filename
from ..auth.models import User

servers_bp = Blueprint('servers', __name__)

@servers_bp.route('/servers', methods=['GET'])
@jwt_required()
def get_servers():
    """
    Obtiene todos los servidores del usuario actual.
    Equivalente a obtener_servidores.php
    """
    current_user_id = get_jwt_identity()
    servers = Server.query.filter_by(user_id=current_user_id).all()
    return jsonify([server.to_dict() for server in servers])

@servers_bp.route('/servers', methods=['POST'])
@jwt_required()
def create_server():
    """
    Crea un nuevo servidor con sus propiedades.
    Equivalente a guardar_servidor.php
    """
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Verificar límite de servidores
    if user.servers_created >= 4:
        return jsonify({'success': False, 'message': 'Has alcanzado el límite de servidores. No puedes crear más.'}), 400
    
    data = request.get_json()
    
    # Validar campos requeridos
    required_fields = ['name', 'software', 'version']
    if not all(field in data for field in required_fields):
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios'}), 400
    
    try:
        # Crear servidor
        server = Server(
            name=data['name'],
            software=data['software'],
            version=data['version'],
            user_id=current_user_id
        )
        
        db.session.add(server)
        db.session.flush()  # Para obtener el ID del servidor
        
        # Crear propiedades del servidor con valores por defecto o proporcionados
        properties = ServerProperties(
            server_id=server.id,
            max_players=data.get('maxPlayers', 20),
            difficulty=DifficultyEnum(data.get('difficulty', 'easy')),
            mode=ModeEnum(data.get('mode', 'survival')),
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
        
        # Actualizar contador de servidores del usuario
        user.servers_created += 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Datos guardados correctamente.',
            'server': server.to_dict(),
            'servers_created': user.servers_created
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error al guardar datos: {str(e)}'}), 500

@servers_bp.route('/servers/<int:server_id>/start', methods=['POST'])
@jwt_required()
def start_server(server_id):
    """
    Inicia un servidor, creando el contenedor si no existe.
    Equivalente a iniciar_servidor.php
    """
    current_user_id = get_jwt_identity()
    server = Server.query.filter_by(id=server_id, user_id=current_user_id).first()
    
    if not server:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404
    
    try:
        if not server.container_id:
            # Generar puerto único
            port = 25565 + server.id
            
            # Obtener propiedades
            properties = server.properties
            
            # Construir comando Docker
            cmd = [
                'sudo', 'docker', 'run', '-d', '-it',
                f'-p {port}:25565',
                '-e EULA=TRUE',
                '-e ONLINE_MODE=FALSE',
                '-e ICON=https://github.com/hammad2003/smai/blob/master/Img/MacacoSmai.png?raw=true',
                f'-e VERSION={server.version}'
            ]
            
            # Añadir propiedades que difieren de los valores por defecto
            if properties.max_players != 20:
                cmd.append(f'-e MAX_PLAYERS={properties.max_players}')
            if properties.difficulty != DifficultyEnum.EASY:
                cmd.append(f'-e DIFFICULTY={properties.difficulty.value}')
            if properties.mode != ModeEnum.SURVIVAL:
                cmd.append(f'-e MODE={properties.mode.value}')
            if properties.max_build_height != 256:
                cmd.append(f'-e MAX_BUILD_HEIGHT={properties.max_build_height}')
            if properties.view_distance != 10:
                cmd.append(f'-e VIEW_DISTANCE={properties.view_distance}')
            if not properties.spawn_npcs:
                cmd.append(f'-e SPAWN_NPCS=false')
            if not properties.allow_nether:
                cmd.append(f'-e ALLOW_NETHER=false')
            if not properties.spawn_animals:
                cmd.append(f'-e SPAWN_ANIMALS=false')
            if not properties.spawn_monsters:
                cmd.append(f'-e SPAWN_MONSTERS=false')
            if not properties.pvp:
                cmd.append(f'-e PVP=false')
            if properties.enable_command_block:
                cmd.append(f'-e ENABLE_COMMAND_BLOCK=true')
            if properties.allow_flight:
                cmd.append(f'-e ALLOW_FLIGHT=true')
            
            # Añadir tipo de servidor
            if server.software == 'Forge':
                cmd.append('-e TYPE=FORGE')
            elif server.software == 'Fabric':
                cmd.append('-e TYPE=FABRIC')
            elif server.software == 'Spigot':
                cmd.append('-e TYPE=SPIGOT')
            elif server.software == 'Bukkit':
                cmd.append('-e TYPE=BUKKIT')
            
            cmd.append('itzg/minecraft-server')
            
            # Ejecutar comando
            result = subprocess.run(' '.join(cmd), shell=True, capture_output=True, text=True)
            
            if result.returncode == 0:
                container_id = result.stdout.strip()
                
                # Obtener IP del host
                ip_result = subprocess.run("hostname -I | cut -d' ' -f1", shell=True, capture_output=True, text=True)
                ip_address = ip_result.stdout.strip()
                
                # Actualizar servidor
                server.container_id = container_id
                server.ip_address = ip_address
                server.port = port
                server.status = 'running'
                
                db.session.commit()
                
                return jsonify({'success': True})
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error al iniciar el servidor Docker',
                    'error': result.stderr
                }), 500
        else:
            # El contenedor ya existe, iniciarlo
            result = subprocess.run(
                f'sudo docker start {server.container_id}',
                shell=True, capture_output=True, text=True
            )
            
            if result.returncode == 0:
                server.status = 'running'
                db.session.commit()
                return jsonify({'success': True})
            else:
                return jsonify({
                    'success': False,
                    'message': 'Error al iniciar el contenedor Docker',
                    'error': result.stderr
                }), 500
                
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al iniciar el servidor',
            'error': str(e)
        }), 500

@servers_bp.route('/servers/<int:server_id>/stop', methods=['POST'])
@jwt_required()
def stop_server(server_id):
    """
    Detiene un servidor en ejecución.
    Equivalente a apagar_servidor.php
    """
    current_user_id = get_jwt_identity()
    server = Server.query.filter_by(id=server_id, user_id=current_user_id).first()
    
    if not server or not server.container_id:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404
    
    try:
        result = subprocess.run(
            f'sudo docker stop {server.container_id}',
            shell=True, capture_output=True, text=True
        )
        
        if result.returncode == 0:
            server.status = 'stopped'
            db.session.commit()
            return jsonify({'success': True})
        else:
            return jsonify({
                'success': False,
                'message': 'Error al detener el contenedor Docker',
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al detener el servidor',
            'error': str(e)
        }), 500

@servers_bp.route('/servers/<int:server_id>/restart', methods=['POST'])
@jwt_required()
def restart_server(server_id):
    """
    Reinicia un servidor en ejecución.
    Equivalente a reiniciar_servidor.php
    """
    current_user_id = get_jwt_identity()
    server = Server.query.filter_by(id=server_id, user_id=current_user_id).first()
    
    if not server or not server.container_id:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404
    
    try:
        result = subprocess.run(
            f'sudo docker restart {server.container_id}',
            shell=True, capture_output=True, text=True
        )
        
        if result.returncode == 0:
            server.status = 'running'
            db.session.commit()
            return jsonify({'success': True})
        else:
            return jsonify({
                'success': False,
                'message': 'Error al reiniciar el contenedor Docker',
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al reiniciar el servidor',
            'error': str(e)
        }), 500

@servers_bp.route('/servers/<int:server_id>', methods=['DELETE'])
@jwt_required()
def delete_server(server_id):
    """
    Elimina un servidor y su contenedor asociado.
    Equivalente a eliminar_servidor.php
    """
    current_user_id = get_jwt_identity()
    server = Server.query.filter_by(id=server_id, user_id=current_user_id).first()
    
    if not server:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404
    
    try:
        # Eliminar contenedor si existe
        if server.container_id:
            subprocess.run(f'sudo docker rm -f {server.container_id}', shell=True)
            subprocess.run('sudo docker volume prune -f', shell=True)
        
        # Eliminar servidor
        db.session.delete(server)
        
        # Actualizar contador de servidores del usuario
        user = User.query.get(current_user_id)
        user.servers_created = Server.query.filter_by(user_id=current_user_id).count()
        
        db.session.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Error al eliminar el servidor',
            'error': str(e)
        }), 500

@servers_bp.route('/servers/<int:server_id>/logs', methods=['GET'])
@jwt_required()
def get_server_logs(server_id):
    """
    Obtiene los logs de un servidor.
    Equivalente a logs.php
    """
    current_user_id = get_jwt_identity()
    server = Server.query.filter_by(id=server_id, user_id=current_user_id).first()
    
    if not server or not server.container_id:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404
    
    try:
        result = subprocess.run(
            f'sudo docker logs --tail 100 {server.container_id}',
            shell=True, capture_output=True, text=True
        )
        
        if result.returncode == 0:
            return jsonify({'success': True, 'logs': result.stdout})
        else:
            return jsonify({
                'success': False,
                'message': 'Error al obtener logs del contenedor',
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al obtener logs del servidor',
            'error': str(e)
        }), 500

@servers_bp.route('/servers/<int:server_id>/console', methods=['GET'])
@jwt_required()
def get_server_console(server_id):
    """
    Obtiene la consola completa de un servidor.
    Equivalente a consola.php
    """
    current_user_id = get_jwt_identity()
    server = Server.query.filter_by(id=server_id, user_id=current_user_id).first()
    
    if not server or not server.container_id:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404
    
    try:
        result = subprocess.run(
            f'sudo docker exec {server.container_id} cat /data/logs/latest.log',
            shell=True, capture_output=True, text=True
        )
        
        if result.returncode == 0:
            return jsonify({'success': True, 'console': result.stdout})
        else:
            return jsonify({
                'success': False,
                'message': 'Error al obtener la consola del contenedor',
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al obtener la consola del servidor',
            'error': str(e)
        }), 500

@servers_bp.route('/servers/<int:server_id>/upload', methods=['POST'])
@jwt_required()
def upload_file(server_id):
    """
    Sube un archivo (mod o plugin) al servidor.
    Equivalente a subir_archivo.php
    """
    current_user_id = get_jwt_identity()
    server = Server.query.filter_by(id=server_id, user_id=current_user_id).first()
    
    if not server or not server.container_id:
        return jsonify({'success': False, 'message': 'Servidor no encontrado'}), 404
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No se ha subido ningún archivo'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'Nombre de archivo no válido'}), 400
    
    try:
        # Determinar directorio de destino basado en el software del servidor
        if server.software in ['Forge', 'Fabric']:
            dest_dir = '/data/mods/'
            local_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'mods')
        elif server.software in ['Spigot', 'Bukkit']:
            dest_dir = '/data/plugins/'
            local_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'plugins')
        else:
            return jsonify({'success': False, 'message': 'Software del servidor no compatible'}), 400
        
        # Crear directorio local si no existe
        os.makedirs(local_dir, exist_ok=True)
        
        # Guardar archivo localmente
        local_path = os.path.join(local_dir, file.filename)
        file.save(local_path)
        
        # Copiar archivo al contenedor
        result = subprocess.run(
            f'sudo docker cp {local_path} {server.container_id}:{dest_dir}',
            shell=True, capture_output=True, text=True
        )
        
        # Eliminar archivo local
        os.remove(local_path)
        
        if result.returncode == 0:
            return jsonify({
                'success': True,
                'message': 'Archivo subido correctamente. Por favor, reinicie el servidor para completar la carga'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error al enviar el archivo al contenedor',
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error al subir el archivo',
            'error': str(e)
        }), 500