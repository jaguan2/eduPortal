import sqlite3
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from auth.auth import auth_bp

app = Flask(__name__)
CORS(app)

# Register the auth Blueprint with a URL prefix
app.register_blueprint(auth_bp, url_prefix='/api')

@app.route("/StudentCourses", methods=['GET'])
def StudentCourses():
    # Get the student ID from the query parameter or return an error if not provided
    current_student = request.args.get('student_id')
    if not current_student:
        return jsonify({"error": "Student ID is required"}), 400

    conn = sqlite3.connect('eduPortalDB.db')

    query = """
    SELECT courses.courseName AS course, courses.semester AS semester, 
           courses.year AS year, courses.credits AS credits, taken.grade AS grade
    FROM taken
    INNER JOIN courses ON taken.course = courses.id
    WHERE taken.student = ?;
    """
    
    student_course_df = pd.read_sql_query(query, conn, params=(current_student,))
    student_course_json = student_course_df.to_json(orient='records')
    conn.close()

    return student_course_json

@app.route('/api/student-info', methods=['GET'])
def get_student_info():
    try:
        # Assuming a Student model with name, id, gpa fields
        student = Student.query.first()  # Replace with actual query for your student
        student_data = {
            "name": student.name,
            "id": student.id,
            "gpa": student.gpa
        }
        return jsonify(student_data), 200
    except Exception as e:
        print(f"Error fetching student info: {e}")
        return jsonify({"error": "Failed to fetch student info"}), 500

# Map roles to their corresponding tables
ROLE_TO_TABLE_MAP = {
    'student': 'students',
    'advisor': 'advisors',
    'instructor': 'instructors',
    'staff': 'staff',
    'admin': 'admin'
}

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
