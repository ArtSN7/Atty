# Import necessary modules and functions
from flask import Blueprint, request, jsonify  # Blueprint for modular routes, request for handling HTTP requests, jsonify for JSON responses
from werkzeug.security import check_password_hash, generate_password_hash  # For password hashing and verification
from flask_login import login_user, logout_user, login_required  # For user session management
from backend.models.user import User  # Import the User model
from backend import db  # Import the database instance


# Create a Blueprint for authentication routes
auth_routes = Blueprint('auth', __name__)

# Route for user signup
@auth_routes.route('/signup', methods=['POST'])
def signup():
    # Get JSON data from the request
    data = request.get_json()

    # Extract username and password from the request
    username = data.get('username')
    password = data.get('password')

    # Hash the password for secure storage
    hashed_password = generate_password_hash(password)

    # Create a new User object with the provided username and hashed password
    new_user = User(username=username, password=hashed_password)

    # Add the new user to the database session
    db.session.add(new_user)
    # Commit the session to save the user to the database
    db.session.commit()

    # Return a success message with HTTP status code 201 (Created)
    return jsonify({'message': 'User created successfully'}), 201


# Route for user login
@auth_routes.route('/', methods=['POST'])
@auth_routes.route('/login', methods=['POST'])
def login():
    # Get JSON data from the request
    data = request.get_json()

    # Query the database for a user with the provided username
    user = User.query.filter_by(username=data.get('username')).first()

    # Check if the user exists and the password is correct
    if user and check_password_hash(user.password, data.get('password')):
        login_user(user)
        return jsonify({'message': 'Login successful'}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


# Route for user logout
@auth_routes.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200