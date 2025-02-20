# backend/routes/chat.py
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from data import db_session
from data.message import Message
from data.user import User  # Import the User model

chat_routes = Blueprint('chat', __name__)

# Example data structure for conversations
conversations_data = [
    {"name": "Alice", "avatar": "https://api.dicebear.com/6.x/adventurer/svg?seed=Alice"},
    {"name": "Bob", "avatar": "https://api.dicebear.com/6.x/adventurer/svg?seed=Bob"},
    # Add more conversations as needed
]

@chat_routes.route('/conversations', methods=['GET'])
def get_conversations():
    # In a real application, fetch conversations from a database
    return jsonify(conversations_data)


@chat_routes.route('/messages/<int:receiver_id>', methods=['GET'])
def get_messages(receiver_id):
    db = db_session.create_session()
    messages = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.timestamp).all()
    return jsonify([{'content': msg.content, 'sender': msg.sender.username, 'timestamp': msg.timestamp} for msg in messages]), 200


@chat_routes.route('/messages', methods=['POST'])
def send_message():
    db = db_session.create_session()
    data = request.json
    message = Message(content=data['content'], sender_id=current_user.id, receiver_id=data['receiver_id'])
    db.add(message)
    db.commit()
    return jsonify({"status": "Message sent"}), 200


@chat_routes.route('/user', methods=['GET'])
def get_user_by_email():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    db = db_session.create_session()
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_data = {
        'name': user.name,
        'email': user.email,
        'bio': user.about,
        'avatar': user.picture
    }

    return jsonify(user_data), 200


@chat_routes.route('/user', methods=['PUT'])
def update_user_by_email():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    db = db_session.create_session()
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update user fields
    user.name = data.get('name', user.name)
    user.about = data.get('bio', user.about)
    user.picture = f"https://api.dicebear.com/9.x/adventurer/svg?seed={user.name}"

    db.commit()

    return jsonify({'message': 'User updated successfully'}), 200