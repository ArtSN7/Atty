from datetime import datetime
from .db_session import SqlAlchemyBase
import sqlalchemy as sqlalchemy
from sqlalchemy import orm

class User(SqlAlchemyBase):
    __tablename__ = 'users'

    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    about = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    email = sqlalchemy.Column(sqlalchemy.String,
                              index=True, unique=True, nullable=True)
    hashed_password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                     default=datetime.now)
    messages_sent = sqlalchemy.orm.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    messages_received = sqlalchemy.orm.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)