import sqlite3
import pandas as pd
from flask import Flask, session, request, jsonify, request
from flask_cors import CORS
from flask_session import Session

app = Flask(__name__)

CORS(app)

def calculateGPA(current_user):
    conn = sqlite3.connect('eduPortalDB.db')

    query = "select courses.courseName as course, courses.credits as credits, taken.grade as grade " + \
            "from taken inner join courses on taken.course = courses.id " + \
            "where taken.student = '" + current_user + "';"
    registered_courses_df = pd.read_sql_query(query, conn)

    conn.close()

    attempted_credits = registered_courses_df['credits'].sum()
    registered_courses_df['earned_credits'] = registered_courses_df['credits'] * registered_courses_df['grade']
    earned_credits = registered_courses_df['earned_credits'].sum()
    current_gpa = earned_credits / attempted_credits

    return current_gpa

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/getGPA", methods=["GET"])
def currentGPA():
    current_user = '1'
    result = calculateGPA(current_user)
    return jsonify(result)

@app.route("/getID", methods=['GET'])
def getID():
    current_user = "1"
    return current_user

@app.route("/getDepartment", methods=['GET'])
def getDepartment():
    current_user = 1
    role = "advisors"
    
    conn = sqlite3.connect('eduPortalDB.db')

    query = f'''
        SELECT department.departmentName
        FROM {role}
        JOIN department ON {role}.department = department.id
        WHERE {role}.id = ?;
    '''
    
    # Execute the query using a parameterized query
    user_df = pd.read_sql(query, conn, params=(current_user,))
    
    if not user_df.empty:
        department = user_df.iloc[0]['departmentName']
        return department
    else:
        return "Department not found", 404

@app.route("/getName", methods=["GET"])
def getName():
    current_user = "1"
    role = "students"

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select username from " + role + " where id = '" + current_user + "';"
    user_df = pd.read_sql(query, conn)
    username = user_df.iloc[0]['username']

    return username

@app.route("/StudentCourses", methods=['GET'])
def StudentCourses():
    # get current student info
    current_user = '1'

    conn = sqlite3.connect('eduPortalDB.db')

    query ="select courses.courseName as course, courses.semester as semester, courses.year as year, courses.credits as credits, taken.grade as grade " + \
            "from taken inner join courses on taken.course = courses.id " + \
            "where taken.student = '" + current_user + "';"
    student_course_df = pd.read_sql_query(query, conn)

    student_course_json = student_course_df.to_dict(orient='records')

    conn.close()

    return jsonify(student_course_json)

@app.route("/whatIfNCourses", methods=['POST'])
def whatIfNCourses():
    current_user = "1"

    # new_courses = request.get_json()
    new_courses = [
        {
            "course": "Ethics",
            "credits": 3,
            "grade": 4,
        },
        {
            "course": "Algorithms",
            "credits": 3,
            "grade": 3.66,
        }
    ]
    new_courses_df = pd.DataFrame(new_courses)

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select courses.courseName as course, courses.credits as credits, taken.grade as grade " + \
            "from taken inner join courses on taken.course = courses.id " + \
            "where taken.student = '" + current_user + "';"
    registered_courses_df = pd.read_sql_query(query, conn)

    conn.close()

    all_courses = pd.concat([new_courses_df, registered_courses_df], ignore_index=True)

    attempted_credits = all_courses['credits'].sum()
    all_courses['earned_credits'] = all_courses['credits'] * all_courses['grade']
    earned_credits = all_courses['earned_credits'].sum()

    gpa = earned_credits / attempted_credits

    all_courses_dict = all_courses.to_dict(orient="records")

    return jsonify(gpa)

@app.route("/whatIfDesiredGPA", methods=["POST"])
def whatIfDesiredGPA():
    # desired_gpa = request.get_json()
    current_user = "1"
    desired_gpa = 3.99

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select courses.courseName as course, courses.credits as credits, taken.grade as grade " + \
            "from taken inner join courses on taken.course = courses.id " + \
            "where taken.student = '" + current_user + "';"
    registered_courses_df = pd.read_sql_query(query, conn)

    conn.close()

    attempted_credits = registered_courses_df['credits'].sum()
    registered_courses_df['earned_credits'] = registered_courses_df['credits'] * registered_courses_df['grade']
    earned_credits = registered_courses_df['earned_credits'].sum()
    current_gpa = earned_credits / attempted_credits

    current_credits = registered_courses_df['credits'].sum()
    registered_courses_df['earned_points'] = registered_courses_df['credits'] * registered_courses_df['grade']
    earned_points = registered_courses_df['earned_points'].sum()

    if (desired_gpa <= current_gpa):
        # ERROR
        result = "Please enter a GPA higher than your current GPA."
    elif (desired_gpa == 4.0):
        # ERROR
        result = "GPA not possible."
    else:
        needed_gpa = 4.0
        result = []
        while needed_gpa >= current_gpa:
            check_divide_by_zero = needed_gpa - desired_gpa
            if (check_divide_by_zero != 0):
                required_credits = ((desired_gpa * current_credits) - earned_points) / (needed_gpa - desired_gpa)
                if ((required_credits > 0) & (required_credits < 120)):
                    required_credits = round(required_credits)
                    this_result = str(required_credits) + " credits needed at a " + str(needed_gpa)
                    result.append(this_result)
            needed_gpa = needed_gpa - 0.3

    if (result == []):
        result = "GPA not possible."

    return result

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

    if (role == "student"):
        role = "students"
    if (role == "advisor"):
        role = "advisors"
    if (role == "instructor"):
        role = "instructors"
    if (role == "System Administrator"):
        role = "admin"
    if (role == "Staff"):
        role = "staff"

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
            session['role'] = role
            return jsonify({"message": "Login successful", "user_id": user_id, "role": role}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    else:
        return jsonify({"error": "User not found"}), 404

#WORK PLEASE
@app.route('/profile', methods=['GET'])
def profile():
    # Check if the user is logged in by verifying 'user_id' in session
    if 'user_id' in session and 'role' in session:
        user_id = session['user_id']
        
        # Convert user_id to a regular Python int
        user_id = int(user_id)
        role = session['role']

        # Print the user_id to the console (for debugging purposes)
        print(f"User ID from session: {user_id}")

        # Return a JSON response to the client with the user_id
        return jsonify({"message": "You are logged in", "user_id": user_id}), 200
    else:
        return jsonify({"error": "You are not logged in"}), 401

@app.route("/viewLogs", methods=["GET"])
def view_logs():
    conn = sqlite3.connect('eduPortalDB.db')
    query = """
        SELECT 
            id AS log_id,
            user_id,
            username,
            operation_type,
            table_name,
            affected_data,
            old_value,
            new_value,
            operation_timestamp
        FROM operation_logs
        ORDER BY operation_timestamp DESC;
    """
    logs_df = pd.read_sql_query(query, conn)
    conn.close()

    logs_json = logs_df.to_dict(orient="records")
    return jsonify(logs_json), 200


@app.route('/addClass/<int:student_id>', methods=['GET', 'POST'])
def addClass(student_id):
    current_user = student_id  # This is the student ID passed from the front-end

    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    if request.method == 'GET':
        courses_query = "SELECT * FROM courses WHERE id NOT IN (SELECT course FROM taken WHERE student = '" + str(current_user) + "' );"
        courses_df = pd.read_sql(courses_query, conn)
        courses_list = courses_df.to_dict(orient='records')

        conn.close()

        if not courses_list:
            return jsonify({"message": "No new courses available"}), 200

        return jsonify(courses_list), 200

    if request.method == 'POST':
        data = request.json
        course_ids = data.get('courseIds')

        if not course_ids:
            return jsonify({"error": "No courses selected"}), 400

        conn = sqlite3.connect('eduPortalDB.db')
        cursor = conn.cursor()

        for course_id in course_ids:
            # taken_query = (
            #     "SELECT * FROM taken WHERE student = " + str(current_user) + 
            #     " AND course = " + str(course_id) + 
            #     " AND semester = (SELECT semester FROM courses WHERE id = " + str(course_id) + ")"
            # )
            # taken_df = pd.read_sql(taken_query, conn)
            # taken_course = taken_df.to_dict(orient='records')

            # if taken_course:
            #     return jsonify({"error": f"Student has already taken course {course_id} in this semester"}), 400

            insert_course = "INSERT INTO taken(student, course) VALUES (" + str(current_user) + ", " + str(course_id) + ")"
            cursor.execute(insert_course)

        conn.commit()
        conn.close()

        return jsonify({"message": "Courses successfully added"}), 200


@app.route('/dropClass/<int:student_id>', methods=['GET', 'POST'])
def dropClass(student_id):
    # if 'user_id' in session and 'role' in session:
    #     user_id = int(session['user_id'])
    #     role = session['role']

    current_user = student_id
    
    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    if request.method == 'GET':
        # Fetch courses that the student is currently enrolled in
        fetch_query = "SELECT * FROM courses WHERE id IN (SELECT course FROM taken WHERE student = '" + str(current_user) + "' );"
        
        
        # "SELECT * FROM students JOIN taken on taken.student = student.id as taken_courses" + \
        # "join courses on taken.course = courses.id " + \
        # "where taken.student = '" + current_user + "';"

        courses_df = pd.read_sql(fetch_query, conn)
        courses_list = courses_df.to_dict(orient='records')

        # Close the connection
        conn.close()

        # If no courses are found, return an empty list (test statement)
        if not courses_list:
            return jsonify({"message": "No courses found"}), 200

        return jsonify(courses_list), 200

    if request.method == 'POST':
        data = request.json
        course_ids = data.get('course_ids')  # Expecting a list of course IDs

        if not course_ids:
            return jsonify({"error": "No courses selected"}), 400

        # Connect to the database for POST request
        conn = sqlite3.connect('eduPortalDB.db')
        cursor = conn.cursor()

        for course_id in course_ids:
            # Check if the student is enrolled in the selected course in the 'taken' table
            check_query = (
                "SELECT * FROM taken WHERE student = " + str(current_user) +
                " AND course = " + str(course_id) +
                " AND semester = (SELECT semester FROM courses WHERE id = " + str(course_id) + ");"
            )

            taken_df = pd.read_sql(check_query, conn)
            taken_course = taken_df.to_dict(orient='records')

            # If the student is enrolled in the course, delete it from 'taken'
            if taken_course:
                delete_query = (
                    "DELETE FROM taken WHERE student = " + str(current_user) +
                    " AND course = " + str(course_id) +
                    " AND semester = (SELECT semester FROM courses WHERE id = " + str(course_id) + ")"
                )
                cursor.execute(delete_query)

            else:
                return jsonify({"error": f"Student is not enrolled in course {course_id}"}), 400

        # Commit the changes and close the connection
        conn.commit()
        conn.close()

        return jsonify({"message": "Courses successfully dropped"}), 200

@app.route('/advisorStudentList', methods=['GET'])
def advisorStudentList():

    # if 'user_id' in session and 'role' in session:
    # user_id = int(session['user_id'])
    # role = session['role']

    current_user = 1 #hardcoded
    
    role = "advisor"  
    
    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    # Get the students for the advisor using the current_user (advisor id)
    students_query = (" \
        select s.id as id, s.username as username, m.majorName as major from (students s join major m on s.major = m.id) \
        as new_s join advisors a on new_s.department = a.department \
        WHERE a.id = " + str(current_user) + ";")
    
    # cursor.execute(students_query, (current_user,))
    # students = cursor.fetchall()

    students_df = pd.read_sql(students_query, conn)

    students_json = students_df.to_dict(orient='records')

    conn.close()

    if not students_json:
        return jsonify({"message": "No students found for this advisor"}), 200

    return jsonify(students_json), 200

if __name__ == "__main__":
    app.run(debug=True)