from werkzeug.security import generate_password_hash

# Define sample user data
users = [
    {"name": "Alice", "about": "Loves coding", "email": "alice@example.com", "password": "password123"},
    {"name": "Bob", "about": "Enjoys hiking", "email": "bob@example.com", "password": "securepass"},
    {"name": "Charlie", "about": "Data scientist", "email": "charlie@example.com", "password": "charlie2024"}
]

# Generate SQL statements
for user in users:
    hashed_password = generate_password_hash(user["password"])
    print(f"INSERT INTO users (name, about, email, hashed_password, created_date) "
          f"VALUES ('{user['name']}', '{user['about']}', '{user['email']}', '{hashed_password}', NOW());")
