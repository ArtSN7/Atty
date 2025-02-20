# Import necessary modules and functions
from flask import Blueprint, request, jsonify  # Blueprint for modular routes, request for handling HTTP requests, jsonify for JSON responses
from werkzeug.security import check_password_hash, generate_password_hash  # For password hashing and verification
from flask_login import login_user, logout_user, login_required  # For user session management
from data.user import User  # Import the User model
from data import db_session  # Import the database session



# Create a Blueprint for authentication routes
auth_routes = Blueprint('auth', __name__)

def get_profile_picture(name):
    return f"https://api.dicebear.com/9.x/adventurer/svg?seed={name}"

# Route for user signup
@auth_routes.route('/signup', methods=['POST'])
def signup():

    db = db_session.create_session()
    # Get JSON data from the request
    data = request.get_json()

    # Extract username and password from the request
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    print(email, password, name)

    # Check if the username already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return jsonify({'message': 'Email already exists', 'error': True}), 201

    # Hash the password for secure storage
    hashed_password = generate_password_hash(password)

    # Create a new User object with the provided username and hashed password
    new_user = User(email=email, hashed_password=hashed_password, name=name, picture=get_profile_picture(name))

    # Add the new user to the database session
    db.add(new_user)
    # Commit the session to save the user to the database
    db.commit()

    # Return a success message with HTTP status code 201 (Created)
    return jsonify({'message': 'User created successfully', 'error': False}), 201


# Route for user login
@auth_routes.route('/login', methods=['POST'])
def login():
    db = db_session.create_session()
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Query the database for the user
    user = db.query(User).filter_by(email=email).first()

    # Check if the user exists and the password is correct
    if user and check_password_hash(user.hashed_password, password):
        login_user(user)  # Log in the user
        return jsonify({'message': 'Login successful', 'error': False}), 200
    else:
        return jsonify({'message': 'Invalid email or password', 'error': True}), 200


# Route for user logout
@auth_routes.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200