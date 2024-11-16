import sqlite3
import sqlalchemy
import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)

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

@app.route("/getID", methods=['GET'])
def getID():
    current_user = "1"

    return current_user

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

    all_courses = pd.concat([new_courses_df, registered_courses_df], ignore_index=True)

    attempted_credits = all_courses['credits'].sum()
    all_courses['earned_credits'] = all_courses['credits'] * all_courses['grade']
    earned_credits = all_courses['earned_credits'].sum()

    gpa = earned_credits / attempted_credits

    all_courses_dict = all_courses.to_dict(orient="records")

    return jsonify(gpa)


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