import sqlite3
from flask import Blueprint, jsonify, request

# Create a Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

# Define a mapping for roles to their tables
ROLE_TO_TABLE_MAP = {
    'student': 'students',
    'advisor': 'advisors',
    'instructor': 'instructors',
    'staff': 'staff',
    'admin': 'admin'
}

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    # Basic validation for required fields
    if not username or not password or not role:
        return jsonify({'error': 'Username, password, and role are required!'}), 400

    # Check if the role exists in our mapping
    table_name = ROLE_TO_TABLE_MAP.get(role.lower())
    if not table_name:
        return jsonify({'error': 'Invalid role specified!'}), 400

    # Connect to the SQLite database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    # Query the appropriate table based on role
    query = f"SELECT * FROM {table_name} WHERE username = ? AND password = ?"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    # Close the connection
    conn.close()

    # Check if the user was found
    if user:
        # Return success response for frontend to detect
        return jsonify({'success': True, 'message': 'Logged in successfully', 'user_id': username, 'role': role}), 200
    else:
        return jsonify({'error': 'Invalid username or password!'}), 401
    
        # Perform login logic here (e.g., checking credentials)
    if login_successful:
        log_action(username, role, f"Logged in successfully")
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Invalid credentials"}), 401
