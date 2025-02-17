# backend/models/user.py
from datetime import datetime
from backend import db, login_manager
from flask_login import UserMixin


# When a user logs in, Flask-Login stores the user_id in the session (a secure cookie).
# For every subsequent request, Flask-Login calls the load_user function to retrieve the user object associated with that user_id.
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    messages_received = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)