# backend/routes/chat.py
from flask import Blueprint, jsonify
from flask_socketio import emit
from backend import socketio, db
from backend.models.message import Message
from flask_login import current_user, login_required

chat_routes = Blueprint('chat', __name__)

@socketio.on('send_message')
@login_required
def handle_send_message(data):
    message = Message(content=data['content'], sender_id=current_user.id, receiver_id=data['receiver_id'])
    db.session.add(message)
    db.session.commit()
    emit('receive_message', {'content': data['content'], 'sender': current_user.username}, room=data['receiver_id'])

@chat_routes.route('/messages/<int:receiver_id>', methods=['GET'])
@login_required
def get_messages(receiver_id):
    messages = Message.query.filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.timestamp).all()
    return jsonify([{'content': msg.content, 'sender': msg.sender.username, 'timestamp': msg.timestamp} for msg in messages]), 200