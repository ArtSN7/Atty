# backend/routes/chat.py
from flask import Blueprint, jsonify, request
from data import db_session
from data.message import Message
from data.user import User  # Import the User model

chat_routes = Blueprint('chat', __name__)

@chat_routes.route('/conversations', methods=['GET'])
def get_conversations():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    db = db_session.create_session()
    user = db.query(User).filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Fetch all distinct users who have communicated with the user
    communicated_user_ids = db.query(Message.sender_id).filter(Message.receiver_id == user.id).distinct().union(
        db.query(Message.receiver_id).filter(Message.sender_id == user.id).distinct()
    ).subquery()

    # Fetch user details excluding the user
    users = db.query(User).filter(User.id.in_(communicated_user_ids)).filter(User.id != user.id).all()

    conversations_data = [
        {
            "name": user.name,  # Example: use the part before '@' as name
            "avatar": f"https://api.dicebear.com/6.x/adventurer/svg?seed={user.name}",
            "email": user.email
        }
        for user in users
    ]
    return jsonify(conversations_data)


@chat_routes.route('/messages', methods=['GET'])
def get_messages():
    email = request.args.get('email')
    receiver_email = request.args.get('receiver_email')
    if not email or not receiver_email:
        return jsonify({'error': 'Email is required'}), 400

    db = db_session.create_session()

    receiver = db.query(User).filter_by(email=receiver_email).first()
    if not receiver:
        return jsonify({'error': 'Receiver not found'}), 404
    
    receiver_id = receiver.id

    db = db_session.create_session()
    user = db.query(User).filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    messages = db.query(Message).filter(
        ((Message.sender_id == user.id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == user.id))
    ).order_by(Message.timestamp).all()
    return jsonify([{'content': msg.content, 'sender': msg.sender.email, 'timestamp': msg.timestamp} for msg in messages]), 200


@chat_routes.route('/messages', methods=['POST'])
def send_message():
    db = db_session.create_session()
    data = request.json
    email = data.get('email')

    print(data)

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = db.query(User).filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    receiver_email = data.get('receiver_email')
    if receiver_email is None:
        return jsonify({'error': 'Receiver email is required'}), 400

    receiver = db.query(User).filter_by(email=receiver_email).first()

    if not receiver:
        return jsonify({'error': 'Receiver not found'}), 404

    message = Message(content=data['content'], sender_id=user.id, receiver_id=receiver.id)
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


@chat_routes.route('/find_people', methods=['GET'])
def find_people():
    query = request.args.get('query', '')
    current_user_email = request.args.get('current_user_email', '')
    if not query or not current_user_email:
        return jsonify([])  # Return empty list if no query or current user email is provided

    db = db_session.create_session()
    # Get the current user's added contacts
    current_user = db.query(User).filter_by(email=current_user_email).first()
    if not current_user:
        return jsonify({'error': 'User not found'}), 404

    added_contacts = db.query(Message.receiver_id).filter(Message.sender_id == current_user.id).distinct()

    # Query the User model to find matches excluding the current user and already added contacts
    matches = db.query(User).filter(
        User.email.ilike(f'%{query}%'),
        User.email != current_user_email,
        User.id.notin_(added_contacts)
    ).limit(5).all()
    
    # Format the results
    results = [{'email': user.email} for user in matches]
    return jsonify(results)


@chat_routes.route('/add_person', methods=['POST'])
def add_person():
    data = request.json
    email = data.get('email')
    current_user_email = data.get('current_user_email')
    if not email or not current_user_email:
        return jsonify({'error': 'current user email and email are required'}), 400

    db = db_session.create_session()
    # Check if user already exists
    user = db.query(User).filter_by(email=email).first()
    if not user:
        # Create a new user if not exists
        user = User(email=email)
        db.add(user)
        db.commit()

    # Identify the sender (current user)
    current_user = db.query(User).filter_by(email=current_user_email).first()
    if not current_user:
        return jsonify({'error': 'Current user not found'}), 404

    # Send a hello message
    hello_message = Message(content='Hello!', sender_id=current_user.id, receiver_id=user.id)
    db.add(hello_message)
    db.commit()

    return jsonify({'message': 'Person added and greeted successfully'}), 201