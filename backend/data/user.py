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
    picture = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                     default=datetime.now)
    messages_sent = sqlalchemy.orm.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    messages_received = sqlalchemy.orm.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)

        # Flask-Login requires these properties
    @property
    def is_active(self):
        # Return True if the user is active, otherwise False
        return True

    @property
    def is_authenticated(self):
        # Return True if the user is authenticated, otherwise False
        return True

    @property
    def is_anonymous(self):
        # Return False as this is not an anonymous user
        return False

    def get_id(self):
        # Return the user ID as a string
        return str(self.id)