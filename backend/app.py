from flask import Flask
from flask_cors import CORS
from extensions import db, socketio, login_manager
from data import db_session

# App setup
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'

# DB settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'  # SQLite database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking

CORS(app)  # Enable CORS for React frontend

# Initialize extensions
db.init_app(app)
socketio.init_app(app, cors_allowed_origins="*")
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

# Import routes and models
from data.user import User
from data.message import Message
from routes.auth import auth_routes
from routes.chat import chat_routes

app.register_blueprint(auth_routes)
app.register_blueprint(chat_routes)

if __name__ == '__main__':
    db_session.global_init("db/App.db")
    socketio.run(app, debug=True)