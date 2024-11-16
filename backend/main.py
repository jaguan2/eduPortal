import sqlite3
import sqlalchemy
import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/StudentCourses", methods=['GET'])
def StudentCourses():
    # get current student info
    current_student = '1'

    conn = sqlite3.connect('eduPortalDB.db')

    query ="select course.courseName as course, course.semester as semester, course.year as year, course.credits as credits, taken.grade as grade " + \
            "from taken inner join course on taken.course = course.id " + \
            "where taken.student = '" + current_student + "';"
    student_course_df = pd.read_sql_query(query)

    student_course_json = student_course_df.to_json(orient='records')

    conn.close()

    return student_course_json

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