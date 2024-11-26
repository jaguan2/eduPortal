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

@app.route("/CourseSummary", methods=['GET'])
def CourseSummary():
    # get current instructor info
    # current_user = session.get('user_id')
    current_user = '1'
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401  # Return error if no user in session
    try:
        conn = sqlite3.connect('eduPortalDB.db')

        query = "select courses.id as courseid, courses.courseName as course, count(taken.student) as totalStudents, avg(taken.grade) as averageGrade " + \
                "from courses " + \
                "left join taken on courses.id = taken.course " + \
                "where courses.instructor = ? " + \
                "group by courses.id, courses.courseName;"
        course_summary_df = pd.read_sql_query(query, conn, params=(current_user,))

        course_summary_json = course_summary_df.to_dict(orient='records')
    finally:
        conn.close()

    return jsonify(course_summary_json)

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
            session['role'] = role # store the user's role
            return jsonify({"message": "Login successful", "user_id": int(user_id), "role": role}), 200
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

@app.route("/admin_gpa_statistics", methods=["GET"])
def admin_gpa_statistics():
    """Fetch highest, lowest, and average GPA for each major."""
    conn = get_db_connection()
    try:
        query = """
        SELECT 
            major.majorName AS major,
            MAX(student_gpa.gpa) AS highest_gpa,
            MIN(student_gpa.gpa) AS lowest_gpa,
            AVG(student_gpa.gpa) AS average_gpa
        FROM 
            (
                SELECT 
                    students.id AS student_id,
                    students.major AS major_id,
                    AVG(taken.grade) AS gpa
                FROM 
                    taken
                JOIN 
                    students ON taken.student = students.id
                GROUP BY 
                    students.id
            ) AS student_gpa
        JOIN 
            major ON student_gpa.major_id = major.id
        GROUP BY 
            major.majorName;
        """
        cursor = conn.execute(query)
        results = cursor.fetchall()

        # Convert query results to a list of dictionaries
        data = [
            {
                "major": row[0],
                "highest_gpa": row[1],
                "lowest_gpa": row[2],
                "average_gpa": row[3]
            }
            for row in results
        ]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/getSystemAdminSemesterCourseStats", methods=["GET"])
def get_admin_semester_course_stats():
    """
    Fetch total enrollments and average grade for each course semester by semester.
    """
    conn = get_db_connection()
    try:
        # SQL Query
        query = """
        SELECT 
            courses.id AS course_id,
            courses.prefix || ' ' || courses.number AS course_code,
            courses.courseName AS course_name,
            courses.semester,
            courses.year,
            COUNT(taken.student) AS total_enrollments,
            AVG(taken.grade) AS average_grade
        FROM 
            courses
        LEFT JOIN 
            taken ON courses.id = taken.course
        GROUP BY 
            courses.id, courses.semester, courses.year
        ORDER BY 
            courses.year, courses.semester, courses.id;
        """
        
        # Execute query
        cursor = conn.execute(query)
        results = cursor.fetchall()

        # Convert results to JSON format
        data = [
            {
                "course_id": row["course_id"],
                "course_code": row["course_code"],
                "course_name": row["course_name"],
                "semester": row["semester"],
                "year": row["year"],
                "total_enrollments": row["total_enrollments"],
                "average_grade": round(row["average_grade"], 2) if row["average_grade"] is not None else None
            }
            for row in results
        ]
        
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/getSystemAdminInstructorStudentByMajor", methods=["GET"])
def getSystemAdminInstructorStudentByMajor():
    """
    For each instructor, list total students by major of every course he/she teaches regardless of semester.
    """
    conn = get_db_connection()
    try:
        query = """
        SELECT 
            instructors.id AS instructor_id,
            instructors.username AS instructor_name,
            major.majorName AS major_name,
            COUNT(DISTINCT taken.student) AS total_students
        FROM instructors
        JOIN courses ON instructors.id = courses.instructor
        JOIN taken ON courses.id = taken.course
        JOIN students ON taken.student = students.id
        JOIN major ON students.major = major.id
        GROUP BY instructors.id, major.id
        ORDER BY instructors.id, major_name;
        """
        cursor = conn.execute(query)
        results = cursor.fetchall()

        # Organize the data into a structured format
        data = []
        for row in results:
            data.append({
                "instructor_id": row[0],
                "instructor_name": row[1],
                "major_name": row[2],
                "total_students": row[3]
            })
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/getListStudentsByMajor", methods=["GET"])
def getListStudentsByMajor():
    """
    List all students by major, sorted within each major by their total credits in descending order.
    """
    conn = get_db_connection()
    try:
        query = """
            SELECT
                major.majorName AS major_name,
                students.id AS student_id,
                students.username AS student_name,
                SUM(courses.credits) AS total_credits
            FROM
                students
            LEFT JOIN
                taken ON students.id = taken.student
            LEFT JOIN
                courses ON taken.course = courses.id
            JOIN
                major ON students.major = major.id
            GROUP BY
                major.majorName, students.id, students.username
            ORDER BY
                major.majorName ASC, total_credits DESC;
        """
        cursor = conn.execute(query)
        results = cursor.fetchall()

        # Flatten the results for simpler frontend consumption
        data = [
            {
                "major_name": row["major_name"],
                "student_id": row["student_id"],
                "student_name": row["student_name"],
                "total_credits": row["total_credits"] or 0  # Handle NULL values
            }
            for row in results
        ]

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# @app.route('/addClass/<int:student_id>', methods=['GET', 'POST'])
# def addClass(student_id):
#     current_user = student_id  # This is the student ID passed from the front-end

#     # Connect to the database
#     conn = sqlite3.connect('eduPortalDB.db')
#     cursor = conn.cursor()

#     if request.method == 'GET':
#         courses_query = "SELECT * FROM courses WHERE id NOT IN (SELECT course FROM taken WHERE student = '" + str(current_user) + "' );"
#         courses_df = pd.read_sql(courses_query, conn)
#         courses_list = courses_df.to_dict(orient='records')

#         conn.close()

#         if not courses_list:
#             return jsonify({"message": "No new courses available"}), 200

#         return jsonify(courses_list), 200

#     if request.method == 'POST':
#         data = request.json
#         course_ids = data.get('courseIds')

#         if not course_ids:
#             return jsonify({"error": "No courses selected"}), 400

#         conn = sqlite3.connect('eduPortalDB.db')
#         cursor = conn.cursor()

#         for course_id in course_ids:
#             # taken_query = (
#             #     "SELECT * FROM taken WHERE student = " + str(current_user) + 
#             #     " AND course = " + str(course_id) + 
#             #     " AND semester = (SELECT semester FROM courses WHERE id = " + str(course_id) + ")"
#             # )
#             # taken_df = pd.read_sql(taken_query, conn)
#             # taken_course = taken_df.to_dict(orient='records')

#             # if taken_course:
#             #     return jsonify({"error": f"Student has already taken course {course_id} in this semester"}), 400

#             insert_course = "INSERT INTO taken(student, course) VALUES (" + str(current_user) + ", " + str(course_id) + ")"
#             cursor.execute(insert_course)

#         conn.commit()
#         conn.close()

#         return jsonify({"message": "Courses successfully added"}), 200


# @app.route('/dropClass/<int:student_id>', methods=['GET', 'POST'])
# def dropClass(student_id):
#     # if 'user_id' in session and 'role' in session:
#     #     user_id = int(session['user_id'])
#     #     role = session['role']

#     current_user = student_id
    
#     # Connect to the database
#     conn = sqlite3.connect('eduPortalDB.db')
#     cursor = conn.cursor()

#     if request.method == 'GET':
#         # Fetch courses that the student is currently enrolled in
#         fetch_query = "SELECT * FROM courses WHERE id IN (SELECT course FROM taken WHERE student = '" + str(current_user) + "' );"
        
        
#         # "SELECT * FROM students JOIN taken on taken.student = student.id as taken_courses" + \
#         # "join courses on taken.course = courses.id " + \
#         # "where taken.student = '" + current_user + "';"

#         courses_df = pd.read_sql(fetch_query, conn)
#         courses_list = courses_df.to_dict(orient='records')

#         # Close the connection
#         conn.close()

#         # If no courses are found, return an empty list (test statement)
#         if not courses_list:
#             return jsonify({"message": "No courses found"}), 200

#         return jsonify(courses_list), 200

#     if request.method == 'POST':
#         data = request.json
#         course_ids = data.get('course_ids')  # Expecting a list of course IDs

#         if not course_ids:
#             return jsonify({"error": "No courses selected"}), 400

#         # Connect to the database for POST request
#         conn = sqlite3.connect('eduPortalDB.db')
#         cursor = conn.cursor()

#         for course_id in course_ids:
#             # Check if the student is enrolled in the selected course in the 'taken' table
#             check_query = (
#                 "SELECT * FROM taken WHERE student = " + str(current_user) +
#                 " AND course = " + str(course_id) +
#                 " AND semester = (SELECT semester FROM courses WHERE id = " + str(course_id) + ");"
#             )

#             taken_df = pd.read_sql(check_query, conn)
#             taken_course = taken_df.to_dict(orient='records')

#             # If the student is enrolled in the course, delete it from 'taken'
#             if taken_course:
#                 delete_query = (
#                     "DELETE FROM taken WHERE student = " + str(current_user) +
#                     " AND course = " + str(course_id) +
#                     " AND semester = (SELECT semester FROM courses WHERE id = " + str(course_id) + ")"
#                 )
#                 cursor.execute(delete_query)

#             else:
#                 return jsonify({"error": f"Student is not enrolled in course {course_id}"}), 400

#         # Commit the changes and close the connection
#         conn.commit()
#         conn.close()

#         return jsonify({"message": "Courses successfully dropped"}), 200

@app.route('/addClass/<int:student_id>', methods=['GET', 'POST'])
def addClass(student_id):
    current_user = student_id  # This is the student ID passed from the front-end

    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    if request.method == 'GET':
        # Fetch courses that the student has not yet taken, include courseName
        courses_query = """
        SELECT id, courseName
        FROM courses
        WHERE id NOT IN (
            SELECT course FROM taken WHERE student = ?
        );
        """
        courses_df = pd.read_sql(courses_query, conn, params=(current_user,))
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
            insert_course = "INSERT INTO taken(student, course) VALUES (?, ?)"
            cursor.execute(insert_course, (current_user, course_id))

        conn.commit()
        conn.close()

        return jsonify({"message": "Courses successfully added"}), 200

@app.route('/dropClass/<int:student_id>', methods=['GET', 'POST'])
def dropClass(student_id):
    current_user = student_id  # This is the student ID passed from the front-end

    # Connect to the database
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()

    if request.method == 'GET':
        # Fetch courses that the student is currently enrolled in, include courseName
        fetch_query = """
        SELECT id, courseName
        FROM courses
        WHERE id IN (
            SELECT course FROM taken WHERE student = ?
        );
        """
        courses_df = pd.read_sql(fetch_query, conn, params=(current_user,))
        courses_list = courses_df.to_dict(orient='records')

        conn.close()

        if not courses_list:
            return jsonify({"message": "No courses found"}), 200

        return jsonify(courses_list), 200

    if request.method == 'POST':
        data = request.json
        course_ids = data.get('course_ids')  # Expecting a list of course IDs

        if not course_ids:
            return jsonify({"error": "No courses selected"}), 400

        conn = sqlite3.connect('eduPortalDB.db')
        cursor = conn.cursor()

        for course_id in course_ids:
            delete_query = "DELETE FROM taken WHERE student = ? AND course = ?"
            cursor.execute(delete_query, (current_user, course_id))

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

# Temporary hardcode for correct username output on dashboards
@app.route("/getAdvisorName", methods=["GET"])
def getAdvisorName():
    current_user = "1"  # Hardcoded for testing
    role = "advisors"

    conn = get_db_connection()

    try:
        query = f"SELECT username FROM {role} WHERE id = ?;"
        user_df = pd.read_sql(query, conn, params=(current_user,))

        if not user_df.empty:
            username = user_df.iloc[0]['username']
            return jsonify({"username": username}), 200
        else:
            return jsonify({"error": "Advisor not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/getInstructorName", methods=["GET"])
def getInstructorName():
    current_user = "1"  # Hardcoded for testing
    role = "instructors"

    conn = get_db_connection()

    try:
        query = f"SELECT username FROM {role} WHERE id = ?;"
        user_df = pd.read_sql(query, conn, params=(current_user,))

        if not user_df.empty:
            username = user_df.iloc[0]['username']
            return jsonify({"username": username}), 200
        else:
            return jsonify({"error": "Instructor not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/getAdminName", methods=["GET"])
def getAdminName():
    current_user = "1"  # Hardcoded for testing
    role = "admin"

    conn = get_db_connection()

    try:
        query = f"SELECT username FROM {role} WHERE id = ?;"
        user_df = pd.read_sql(query, conn, params=(current_user,))

        if not user_df.empty:
            username = user_df.iloc[0]['username']
            return jsonify({"username": username}), 200
        else:
            return jsonify({"error": "Admin not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/admin_department_gpa_rankings", methods=["GET"])
def admin_department_gpa_rankings():
    """Rank all departments by average GPA, including highest and lowest GPAs."""
    conn = get_db_connection()
    try:
        query = """
        SELECT 
            department.departmentName AS department_name,
            MAX(student_gpa.gpa) AS highest_gpa,
            MIN(student_gpa.gpa) AS lowest_gpa,
            AVG(student_gpa.gpa) AS average_gpa
        FROM 
            (
                SELECT 
                    students.id AS student_id,
                    major.department AS department_id,
                    AVG(taken.grade) AS gpa
                FROM 
                    taken
                JOIN 
                    students ON taken.student = students.id
                JOIN 
                    major ON students.major = major.id
                GROUP BY 
                    students.id
            ) AS student_gpa
        JOIN 
            department ON student_gpa.department_id = department.id
        GROUP BY 
            department.departmentName
        ORDER BY 
            average_gpa DESC;
        """
        cursor = conn.execute(query)
        results = cursor.fetchall()

        # Convert query results to a list of dictionaries
        data = [
            {
                "department_name": row[0],
                "highest_gpa": row[1],
                "lowest_gpa": row[2],
                "average_gpa": row[3]
            }
            for row in results
        ]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

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

@app.route("/getStaffManageInstructors", methods=['GET'])
def getStaffManageInstructors():
    """Fetch all instructors under the same department as the hardcoded staff user, including their password."""
    conn = get_db_connection()
    query = '''
        SELECT id AS instructor_id, username, password
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
        # log_operation(user_id, username, 'UPDATE', 'courses', f'Assigned instructor {instructor_id} to course {course_id}')
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

@app.route("/manage_instructors", methods=['POST'])
def manage_instructors():
    """Manage instructor operations: add, update, or delete."""
    data = request.json
    action = data.get('action')  # 'add', 'update', 'delete'
    instructor_id = data.get('id')
    username = data.get('username')
    password = data.get('password')
    department_id = 1  # Hardcoded department ID

    conn = get_db_connection()
    try:
        if action == 'add':
            conn.execute('INSERT INTO instructors (username, password, department) VALUES (?, ?, ?)',
                         (username, password, department_id))
        elif action == 'update':
            conn.execute('UPDATE instructors SET username = ?, password = ?, department = ? WHERE id = ?',
                         (username, password, department_id, instructor_id))
        elif action == 'delete':
            conn.execute('DELETE FROM instructors WHERE id = ?', (instructor_id,))
        else:
            return jsonify({'error': 'Invalid action'}), 400
        conn.commit()
        return jsonify({'message': 'Operation successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route("/getStaffMajors", methods=["GET"])
def getStaffMajors():
    """Fetch all majors for the staff's department."""
    # Example: Hardcoded staff department for testing
    staff_department_id = 1  # Replace this with dynamic retrieval later

    conn = get_db_connection()
    try:
        # Query to fetch majors belonging to the staff's department
        query = """
        SELECT id, majorName
        FROM major
        WHERE department = ?
        """
        cursor = conn.execute(query, (staff_department_id,))
        results = cursor.fetchall()

        # If no majors are found, return a friendly error
        if not results:
            return jsonify({"error": "No majors found for this department"}), 404

        # Format the results into a list of dictionaries
        majors = [{"id": row[0], "majorName": row[1]} for row in results]
        return jsonify({"majors": majors}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/manage_students", methods=['POST'])
def manage_students():
    """Manage student operations: add, update, or delete."""
    data = request.json
    action = data.get('action')  # 'add', 'update', 'delete'
    student_id = data.get('id')
    username = data.get('username')
    password = data.get('password')
    major_id = data.get('major')  # Include major

    conn = get_db_connection()

    try:
        if action == 'add':
            # Add a new student
            conn.execute(
                '''
                INSERT INTO students (username, password, major)
                VALUES (?, ?, ?)
                ''',
                (username, password, major_id)
            )
            conn.commit()
            return jsonify({'message': 'Student added successfully'}), 200

        elif action == 'update':
            # Update an existing student
            conn.execute(
                '''
                UPDATE students
                SET username = ?, password = ?, major = ?
                WHERE id = ?
                ''',
                (username, password, major_id, student_id)
            )
            conn.commit()
            return jsonify({'message': 'Student updated successfully'}), 200

        elif action == 'delete':
            # Ensure student is not the only one in their major before deletion
            major_students = conn.execute(
                'SELECT COUNT(*) FROM students WHERE major = ?', (major_id,)
            ).fetchone()[0]
            if major_students <= 1:
                return jsonify({'error': 'Cannot delete the only student in this major'}), 400

            conn.execute('DELETE FROM students WHERE id = ?', (student_id,))
            conn.commit()
            return jsonify({'message': 'Student deleted successfully'}), 200

        else:
            return jsonify({'error': 'Invalid action'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route("/getStaffStudents", methods=["GET"])
def getStaffStudents():
    """Fetch all students from the same department as the staff."""
    # Simulated staff ID and department for testing (replace with actual session/user management later)
    staff_id = 1  # Hardcoded for testing
    conn = get_db_connection()

    try:
        # Fetch the department ID of the staff member
        staff_department_query = "SELECT department FROM staff WHERE id = ?"
        staff_department = conn.execute(staff_department_query, (staff_id,)).fetchone()

        if not staff_department:
            return jsonify({"error": "Staff not found"}), 404

        # Fetch students from the same department
        department_id = staff_department[0]
        query = """
        SELECT 
            students.id, 
            students.username, 
            students.password, 
            major.majorName 
        FROM 
            students
        JOIN 
            major ON students.major = major.id
        WHERE 
            major.department = ?
        """
        students = conn.execute(query, (department_id,)).fetchall()

        # Convert results to JSON format
        results = [
            {
                "id": row[0],
                "username": row[1],
                "password": row[2],
                "major": row[3]
            }
            for row in students
        ]
        return jsonify({"students": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/manage_advisors", methods=['POST'])
def manage_advisors():
    """Manage advisor operations: add, update, or delete."""
    data = request.json
    action = data.get('action')  # 'add', 'update', 'delete'
    advisor_id = data.get('id')
    username = data.get('username')
    password = data.get('password')
    department_id = 1  # Hardcoded department ID for now

    # Validate required fields
    if not action or (action != 'add' and not advisor_id):
        return jsonify({'error': 'Action and Advisor ID are required for update/delete operations.'}), 400

    if action in ['add', 'update'] and not all([username, password]):
        return jsonify({'error': 'Username and Password are required for add/update operations.'}), 400

    if action == 'add' and not department_id:
        return jsonify({'error': 'Department is required for adding an advisor.'}), 400

    # Ensure username and ID are not the same
    if username == str(advisor_id):
        return jsonify({'error': 'Username and ID cannot be the same. Please choose a unique username.'}), 400

    conn = get_db_connection()
    try:
        if action == 'add':
            # Ensure advisor does not already exist with the same username
            existing_advisor = conn.execute(
                'SELECT * FROM advisors WHERE username = ?',
                (username,)
            ).fetchone()
            if existing_advisor:
                return jsonify({'error': 'An advisor with this username already exists. Please use the update action.'}), 400

            # Add the new advisor
            conn.execute(
                'INSERT INTO advisors (username, password, department) VALUES (?, ?, ?)',
                (username, password, department_id)
            )

        elif action == 'update':
            # Ensure the advisor exists
            existing_advisor = conn.execute(
                'SELECT * FROM advisors WHERE id = ?',
                (advisor_id,)
            ).fetchone()
            if not existing_advisor:
                return jsonify({'error': 'Advisor not found for update. Please use the add action to create a new advisor.'}), 404

            # Update advisor
            conn.execute(
                '''
                UPDATE advisors 
                SET username = ?, password = ?, department = ? 
                WHERE id = ?
                ''',
                (username, password, department_id, advisor_id)
            )

        elif action == 'delete':
            # Ensure the advisor exists
            existing_advisor = conn.execute(
                'SELECT * FROM advisors WHERE id = ?',
                (advisor_id,)
            ).fetchone()
            if not existing_advisor:
                return jsonify({'error': 'Advisor not found for deletion.'}), 404

            # Delete advisor
            conn.execute('DELETE FROM advisors WHERE id = ?', (advisor_id,))

        else:
            return jsonify({'error': 'Invalid action specified.'}), 400

        conn.commit()
        return jsonify({'message': 'Operation successful'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        conn.close()

@app.route("/getStaffAdvisors", methods=['GET'])
def get_staff_advisors():
    """Fetch all advisors for the hardcoded department."""
    department_id = 1  # Hardcoded department ID
    conn = get_db_connection()
    try:
        query = '''
            SELECT id, username, password, department
            FROM advisors
            WHERE department = ?;
        '''
        advisors = conn.execute(query, (department_id,)).fetchall()
        advisors_list = [dict(row) for row in advisors]
        return jsonify(advisors_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(debug=True)
