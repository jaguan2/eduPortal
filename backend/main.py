import sqlite3
import sqlalchemy
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

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

@app.route("/getGPA", methods=["GET"])
def currentGPA():
    current_user = '3'
    result = calculateGPA(current_user)
    return jsonify(result)

@app.route("/getID", methods=['GET'])
def getID():
    current_user = "1"
    return current_user

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

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Simple validation
    if not username or not password:
        return jsonify({'error': 'Username and password are required!'}), 400

    # query database to check if user exists
        return jsonify({'error': 'Invalid username or password!'}), 401

    return jsonify({'message': 'Logged in successfully', 'user_id': username}), 200

if __name__ == "__main__":
    app.run(debug=True)