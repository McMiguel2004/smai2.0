from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
from sqlalchemy import Enum as SAEnum
from ..auth.models import db

class DifficultyEnum(Enum):
    HARD = 'hard'
    NORMAL = 'normal'
    EASY = 'easy'
    PEACEFUL = 'peaceful'

class ModeEnum(Enum):
    CREATIVE = 'creative'
    SURVIVAL = 'survival'
    ADVENTURE = 'adventure'
    SPECTATOR = 'spectator'

class Server(db.Model):
    __tablename__ = 'servers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    software = db.Column(db.String(50), nullable=False)
    version = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    container_id = db.Column(db.String(255))
    status = db.Column(db.String(20), default='stopped')
    ip_address = db.Column(db.String(255))
    port = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    properties = db.relationship(
        'ServerProperties', backref='server', uselist=False,
        cascade='all, delete-orphan'
    )
    user = db.relationship('User', backref='servers')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'software': self.software,
            'version': self.version,
            'user_id': self.user_id,
            'container_id': self.container_id,
            'status': self.status,
            'ip_address': self.ip_address,
            'port': self.port,
            'created_at': self.created_at.isoformat(),
            'properties': self.properties.to_dict() if self.properties else None
        }

class ServerProperties(db.Model):
    __tablename__ = 'server_properties'

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False)

    difficulty = db.Column(
        SAEnum(
            DifficultyEnum,
            name='difficultyenum',
            values_callable=lambda enum: [e.value for e in enum]
        ),
        default=DifficultyEnum.EASY
    )
    mode = db.Column(
        SAEnum(
            ModeEnum,
            name='modeenum',
            values_callable=lambda enum: [e.value for e in enum]
        ),
        default=ModeEnum.SURVIVAL
    )
    max_players = db.Column(db.Integer, default=20)
    max_build_height = db.Column(db.Integer, default=256)
    view_distance = db.Column(db.Integer, default=10)
    spawn_npcs = db.Column(db.Boolean, default=True)
    allow_nether = db.Column(db.Boolean, default=True)
    spawn_animals = db.Column(db.Boolean, default=True)
    spawn_monsters = db.Column(db.Boolean, default=True)
    pvp = db.Column(db.Boolean, default=True)
    enable_command_block = db.Column(db.Boolean, default=False)
    allow_flight = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'difficulty': self.difficulty.value if self.difficulty else None,
            'mode': self.mode.value if self.mode else None,
            'max_players': self.max_players,
            'max_build_height': self.max_build_height,
            'view_distance': self.view_distance,
            'spawn_npcs': self.spawn_npcs,
            'allow_nether': self.allow_nether,
            'spawn_animals': self.spawn_animals,
            'spawn_monsters': self.spawn_monsters,
            'pvp': self.pvp,
            'enable_command_block': self.enable_command_block,
            'allow_flight': self.allow_flight
        }
