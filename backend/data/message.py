from datetime import datetime
import sqlalchemy as sqlalchemy
from .db_session import SqlAlchemyBase

class Message(SqlAlchemyBase):
    __tablename__ = 'messages'

    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    content = sqlalchemy.Column(sqlalchemy.String(500), nullable=False)
    timestamp = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.utcnow)
    sender_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    receiver_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)