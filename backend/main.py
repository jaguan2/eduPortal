import sqlite3
import pandas as pd
from flask import Flask, session, request, jsonify
from flask_session import Session

app = Flask(__name__)

# Configure session management
app.secret_key = "your_secret_key"  # This key secures your sessions
app.config["SESSION_TYPE"] = "filesystem"  # Use "redis" for scalability in production
Session(app)

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    role = data.get('role')
    username = data.get('username')
    password = data.get('password') 

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    # Query to get user ID, password, and role
    query = "SELECT * FROM " + role + " WHERE username = '" + username + "';"
    user_df = pd.read_sql(query, conn)
    user = user_df.iloc[0]['username']
    stored_password = user_df.iloc[0]['password']

    # cursor.execute(query, (username, password))
    # user = cursor.fetchone()  # Fetch one record
    conn.close()

    if user:
        # stored_password = user[1]  # Get the stored password
        if stored_password == password:  # Direct comparison
            # If credentials match, set the session
            user_id = user_df.iloc[0]['id'] 
            session['user_id'] = user_id
            return jsonify({"message": "Login successful", "user_id": int(user_id)}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    else:
        return jsonify({"error": "User not found"}), 404

#WORK PLEASE
@app.route('/profile', methods=['GET'])
def profile():
    # Check if the user is logged in by verifying 'user_id' in session
    if 'user_id' in session:
        user_id = session['user_id']
        
        # Convert user_id to a regular Python int
        user_id = int(user_id)

        # Print the user_id to the console (for debugging purposes)
        print(f"User ID from session: {user_id}")

        # Return a JSON response to the client with the user_id
        return jsonify({"message": "You are logged in", "user_id": user_id}), 200
    else:
        return jsonify({"error": "You are not logged in"}), 401

@app.route("/StudentCourses", methods=['GET'])
def StudentCourses():
    # get current student info
    current_student = '123'

    conn = sqlite3.connect('eduPortalDB.db')

    query ="select course.courseName as course, course.semester as semester, course.year as year, course.credits as credits, taken.grade as grade " + \
            "from taken inner join course on taken.course = course.id " + \
            "where taken.student = '" + current_student + "';"
    student_course_df = pd.read_sql_query(query)

    student_course_json = student_course_df.to_json(orient='records')

    conn.close()

    return student_course_json