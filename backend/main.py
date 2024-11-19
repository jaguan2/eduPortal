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
    role = "instructors"
    
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

@app.route("/getCourseStudents", methods=['POST'])
def getCourseStudents():
    current_user = 1
    role = "instructors"
    data = request.get_json()
    course_id = data.get('id')

    print(course_id)
    
    conn = sqlite3.connect('eduPortalDB.db')

    query = f'''
        SELECT s.id as id, s.username as name, t.grade as grade 
        from (courses c join taken t on c.id = t.course) as new_t join students s on new_t.student = s.id 
        where c.id = ?;
    '''
    
    # Execute the query using a parameterized query
    students_df = pd.read_sql(query, conn, params=(course_id,))
    students_list = students_df.to_dict(orient='records')
    
    if not students_df.empty:
        print(students_list)
        return jsonify(students_list)
    else:
        return "Students not found", 404

@app.route("/getName", methods=["GET"])
def getName():
    current_user = "1"
    role = "students"

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select username from " + role + " where id = '" + current_user + "';"
    user_df = pd.read_sql(query, conn)
    username = user_df.iloc[0]['username']

    return username

@app.route("/getSystemLogs", methods=['GET'])
def getSystemLogs():
    current_user = "1"
    role="admin"

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select operation_timestamp, user_id, operation_type, table_name, affected_data " + \
            "from system_logs " + \
            "where user_id = ?;"
    
    # Execute the query using a parameterized query
    systemLogs_df = pd.read_sql(query, conn, params=(current_user,))
    
    if not systemLogs_df.empty:
        system_logs = systemLogs_df.to_dict(orient='records')
        return jsonify(system_logs)
    else:
        return "No logs found for the user", 404

@app.route("/StudentCourses", methods=['GET'])
def StudentCourses():
    # get current student info
    current_user = '1'

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select courses.courseName as course, courses.semester as semester, courses.year as year, courses.credits as credits, taken.grade as grade " + \
            "from taken inner join courses on taken.course = courses.id " + \
            "where taken.student = '" + current_user + "';"
    student_course_df = pd.read_sql_query(query, conn)

    student_course_json = student_course_df.to_dict(orient='records')

    conn.close()

    return jsonify(student_course_json)

# WORK IN PROGRESS
@app.route("/InstructorCourses", methods=['GET'])
def InstructorCourses():
    # get current instructor info
    current_user = '1'

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select courses.id as courseid, courses.courseName as course, courses.semester as semester, courses.year as year " + \
            "from courses " + \
            "where courses.instructor = ?;"
    instructor_course_df = pd.read_sql_query(query, conn, params=(current_user,))

    instructor_course_json = instructor_course_df.to_dict(orient='records')

    conn.close()

    return jsonify(instructor_course_json)

@app.route("/whatIfNCourses", methods=['POST'])
def whatIfNCourses():
    current_user = "1"

    new_courses = request.get_json()
    new_courses_df = pd.DataFrame(new_courses)

    print(new_courses_df)

    conn = sqlite3.connect('eduPortalDB.db')

    query = "select courses.courseName as course, courses.credits as credits, taken.grade as grade " + \
            "from taken inner join courses on taken.course = courses.id " + \
            "where taken.student = '" + current_user + "';"
    registered_courses_df = pd.read_sql_query(query, conn)

    all_courses = pd.concat([new_courses_df, registered_courses_df], ignore_index=True)

    attempted_credits = all_courses['credits'].sum()
    all_courses['earned_credits'] = all_courses['credits'] * all_courses['grade']
    earned_credits = all_courses['earned_credits'].sum()

    gpa = earned_credits / attempted_credits

    gpa = round(gpa, 2)

    # all_courses_dict = all_courses.to_dict(orient="records")

    return jsonify(gpa)

@app.route("/whatIfDesiredGPA", methods=["POST"])
def whatIfDesiredGPA():
    data = request.get_json()
    desired_gpa = float(data.get('number'))
    current_user = "1"

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

    if (desired_gpa <= 0):
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
                required_credits = ((desired_gpa * attempted_credits) - earned_credits) / (needed_gpa - desired_gpa)
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
        FROM system_logs
        ORDER BY operation_timestamp DESC;
    """
    logs_df = pd.read_sql_query(query, conn)
    conn.close()

    logs_json = logs_df.to_dict(orient="records")
    return jsonify(logs_json), 200

# STAFF FLASK ROUTES

# Hardcoded staff user and department ID
STAFF_USER_ID = 1
StaffDepartment_ID = 1

# Database connection helper
def get_db_connection():
    conn = sqlite3.connect('eduPortalDB.db')
    conn.row_factory = sqlite3.Row  # Allows fetching rows as dictionaries
    return conn

@app.route("/getStaffID", methods=['GET'])
def getStaffID():
    """Fetch hardcoded staff ID."""
    return jsonify({"uid": STAFF_USER_ID})

@app.route("/getStaffDepartment", methods=['GET'])
def getStaffDepartment():
    """Fetch the department name of the hardcoded staff user."""
    conn = get_db_connection()
    query = '''
        SELECT department.id AS department_id, department.departmentName AS department_name
        FROM staff
        JOIN department ON staff.department = department.id
        WHERE staff.id = ?;
    '''
    try:
        user_df = pd.read_sql_query(query, conn, params=(STAFF_USER_ID,))
        if not user_df.empty:
            # Modify the response to include 'department' as a key
            return jsonify({
                "department_id": int(user_df.iloc[0]['department_id']),
                "department": user_df.iloc[0]['department_name']  # Add this key
            }), 200
        else:
            return jsonify({"error": "Department not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/getStaffInstructors", methods=['GET'])
def getStaffInstructors():
    """Fetch all instructors under the same department as the hardcoded staff user."""
    conn = get_db_connection()
    query = '''
        SELECT id AS instructor_id, username
        FROM instructors
        WHERE department = ?;
    '''
    try:
        instructors = conn.execute(query, (StaffDepartment_ID,)).fetchall()
        return jsonify([dict(instructor) for instructor in instructors]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/getStaffCourses", methods=['GET'])
def getStaffCourses():
    """Fetch all courses under the same department as the hardcoded staff user."""
    conn = get_db_connection()
    query = '''
        SELECT id, prefix, number, courseName, credits, semester, year, classTime, classDay, instructor
        FROM courses
        WHERE department = ?;
    '''
    try:
        courses = conn.execute(query, (StaffDepartment_ID,)).fetchall()
        return jsonify([dict(course) for course in courses]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/manage_courses", methods=['POST'])
def manage_courses():
    """Manage course operations: add, update, or delete."""
    data = request.json
    action = data.get('action')  # 'add', 'update', 'delete'
    course_id = data.get('id')
    course_name = data.get('courseName')
    prefix = data.get('prefix')
    number = data.get('number')
    credits = data.get('credits')
    semester = data.get('semester')
    year = data.get('year')
    class_time = data.get('classTime')
    class_day = data.get('classDay')
    instructor_id = data.get('instructor')
    department_id = StaffDepartment_ID  # Hardcoded department
    conn = get_db_connection()

    try:
        # ADD Course
        if action == 'add':
            # Check if course ID already exists
            existing_course = conn.execute('SELECT * FROM courses WHERE id = ?', (course_id,)).fetchone()
            if existing_course:
                return jsonify({'error': 'Course ID already exists'}), 400

            # Check for instructor conflicts (if instructor is provided)
            if instructor_id and class_time and class_day:
                conflicts = conn.execute(
                    '''
                    SELECT * FROM courses 
                    WHERE instructor = ? AND classTime = ? AND classDay = ? AND semester = ? AND year = ?
                    ''', (instructor_id, class_time, class_day, semester, year)
                ).fetchall()
                if conflicts:
                    return jsonify({'error': 'Instructor has a scheduling conflict'}), 400

            # Insert new course
            conn.execute(
                '''
                INSERT INTO courses (id, prefix, number, courseName, credits, semester, year, classTime, classDay, instructor, department)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (course_id, prefix, number, course_name, credits, semester, year, class_time, class_day, instructor_id, department_id)
            )
            conn.commit()
            return jsonify({'message': 'Course added successfully'}), 200

        # UPDATE Course
        elif action == 'update':
            # Check if the course exists
            existing_course = conn.execute('SELECT * FROM courses WHERE id = ?', (course_id,)).fetchone()
            if not existing_course:
                return jsonify({'error': 'Course not found'}), 404

            # Check for instructor conflicts (if instructor is updated)
            if instructor_id and class_time and class_day:
                conflicts = conn.execute(
                    '''
                    SELECT * FROM courses 
                    WHERE instructor = ? AND classTime = ? AND classDay = ? AND semester = ? AND year = ? AND id != ?
                    ''', (instructor_id, class_time, class_day, semester, year, course_id)
                ).fetchall()
                if conflicts:
                    return jsonify({'error': 'Instructor has a scheduling conflict'}), 400

            # Update course
            conn.execute(
                '''
                UPDATE courses
                SET prefix = ?, number = ?, courseName = ?, credits = ?, semester = ?, year = ?, classTime = ?, classDay = ?, instructor = ?
                WHERE id = ?
                ''', (prefix, number, course_name, credits, semester, year, class_time, class_day, instructor_id, course_id)
            )
            conn.commit()
            return jsonify({'message': 'Course updated successfully'}), 200

        # DELETE Course
        elif action == 'delete':
            # Check if the course exists
            existing_course = conn.execute('SELECT * FROM courses WHERE id = ?', (course_id,)).fetchone()
            if not existing_course:
                return jsonify({'error': 'Course not found'}), 404

            # Delete course
            conn.execute('DELETE FROM courses WHERE id = ?', (course_id,))
            conn.commit()
            return jsonify({'message': 'Course deleted successfully'}), 200

        else:
            return jsonify({'error': 'Invalid action'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route("/assign_instructors", methods=['POST'])
def assign_instructors():
    """Assign instructors to a course."""
    data = request.json
    course_id = data.get('course_id')
    instructor_id = data.get('instructor_id')
    user_id = STAFF_USER_ID  # Hardcoded staff ID
    username = data.get('username', 'staff_user')

    conn = get_db_connection()
    try:
        instructor = conn.execute('SELECT * FROM instructors WHERE id = ? AND department = ?',
                                  (instructor_id, StaffDepartment_ID)).fetchone()
        if not instructor:
            return jsonify({'error': 'Instructor does not belong to the same department'}), 403

        conn.execute('UPDATE courses SET instructor = ? WHERE id = ?', (instructor_id, course_id))
        log_operation(user_id, username, 'UPDATE', 'courses', f'Assigned instructor {instructor_id} to course {course_id}')
        conn.commit()
        return jsonify({'message': 'Instructor assigned successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# Validates if staff member is allowed to perform actions tied to a specific department
@app.route('/staff_in_department', methods=['GET'])
def staff_in_department():
    # user_id = request.args.get('user_id')
    # department_id = request.args.get('department_id')
    user_id = 1  # Hardcoded for testing
    department_id = 1

    conn = get_db_connection()
    staff_user = conn.execute(
        'SELECT * FROM staff WHERE id = ? AND department = ?',
        (user_id, department_id)
    ).fetchone()
    conn.close()
    if staff_user:
        return jsonify({'message': 'Staff belongs to the department'}), 200
    else:
        return jsonify({'error': 'Staff does not belong to the department'}), 403

@app.route("/getStaffName", methods=["GET"])
def getStaffName():
    current_user = "1"  # Hardcoded for testing
    role = "staff"

    conn = sqlite3.connect('eduPortalDB.db')

    try:
        query = f"SELECT username FROM {role} WHERE id = ?;"
        user_df = pd.read_sql(query, conn, params=(current_user,))
        
        if not user_df.empty:
            username = user_df.iloc[0]['username']
            return jsonify({"username": username}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(debug=True)
