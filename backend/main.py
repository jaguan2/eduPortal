import sqlite3
import pandas as pd
from flask import Flask, session, request, jsonify
from flask_session import Session

app = Flask(__name__)

# Configure session management
app.secret_key = "your_secret_key"  # This key secures your sessions
app.config["SESSION_TYPE"] = "filesystem"  # Use "redis" for scalability in production
Session(app)

# Helper function to authenticate user and set session
def authenticate_and_set_session(username, role):
    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    # Map roles to their respective tables
    role_mapping = {
        'student': 'students',
        'instructor': 'instructors',
        'staff': 'staff',
        'admin': 'admin'
    }

    table = role_mapping.get(role)
    if not table:
        return {"error": "Invalid role"}, 400

    # Use parameterized queries to avoid SQL injection
    query = f"SELECT id FROM {table} WHERE username = ?;"
    cursor.execute(query, (username,))
    user = cursor.fetchone()  # Fetch one record
    conn.close()

    if user:
        # Store the user ID and role in the session
        session['user_id'] = user[0]
        session['role'] = role
        return {"message": "Login successful", "user_id": user[0]}, 200
    else:
        return {"error": "Invalid credentials"}, 401

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    data = request.json
    username = data.get('username')
    role = data.get('role')  # Assume role is sent in the request body

    if not username or not role:
        return jsonify({"error": "Missing username or role"}), 400

    # Authenticate user and set session
    response, status_code = authenticate_and_set_session(username, role)
    return jsonify(response), status_code

# Student courses route
@app.route("/StudentCourses", methods=['GET'])
def student_courses():
    # Check if the user is logged in
    if 'user_id' not in session or session.get('role') != 'student':
        return jsonify({"error": "Unauthorized"}), 401  # User not logged in or not a student

    # Get current student info from session
    current_student = session['user_id']

    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')

    query = """
        SELECT course.courseName AS course, course.semester AS semester, 
               course.year AS year, course.credits AS credits, 
               taken.grade AS grade 
        FROM taken 
        INNER JOIN course ON taken.course = course.id 
        WHERE taken.student = ?;
    """
    # Use parameterized query to fetch data
    student_course_df = pd.read_sql_query(query, conn, params=(current_student,))
    conn.close()

    # Convert the result to JSON
    student_course_json = student_course_df.to_json(orient='records')
    print(student_course_json)
    return student_course_json

# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear the session data
    return jsonify({"message": "Logged out successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)
