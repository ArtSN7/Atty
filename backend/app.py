from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS


# app set up
app = Flask(__name__)

app.config['SECRET_KEY'] = 'your-secret-key'

# DB settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'  # SQLite database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking

CORS(app)  # Enable CORS for React frontend

db = SQLAlchemy(app) # Initializes SQLAlchemy for database operations. The db object will be used to define models and interact with the database.

socketio = SocketIO(app, cors_allowed_origins="*") # Initializes Flask-SocketIO for real-time communication. The cors_allowed_origins="*" allows WebSocket connections from any origin.

login_manager = LoginManager(app) # Initializes Flask-Login for managing user authentication.

# Import routes and models
from models.user import User
from models.message import Message
from routes.auth import auth_routes
from routes.chat import chat_routes

app.register_blueprint(auth_routes)
app.register_blueprint(chat_routes)

if __name__ == '__main__':
    socketio.run(app, debug=True)