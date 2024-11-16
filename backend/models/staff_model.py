import sqlite3
from flask import Flask, jsonify, request

def is_staff(user_id):
    conn = sqlite3.connect("eduPortalDB.db")
    cursor = conn.cursor()
    result = cursor.execute("SELECT role FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return result and result[0] == "staff"

@app.route('/api/staff/report/<string:report_type>', methods=['GET'])
def generate_staff_report(report_type):
    user_id = request.args.get('user_id')  # Assume user_id is passed in query params
    if not is_staff(user_id):
        return jsonify({"error": "Unauthorized access"}), 403

    if report_type == "GPA_summary":
        return jsonify("GPA summary report data")
    elif report_type == "department_ranking":
        return jsonify("Department ranking report data")
    elif report_type == "course_enrollment_summary":
        return jsonify("Course enrollment summary data")
    else:
        return jsonify({"error": f"Unknown report type: {report_type}"}), 400

@app.route('/api/staff/report/<string:report_type>', methods=['GET'])
def generate_staff_report(report_type):
    # Implement report generation logic for staff
    if report_type == "GPA_summary":
        # Logic for GPA summary report
        return jsonify("GPA summary report data")
    elif report_type == "department_ranking":
        # Logic for department ranking report
        return jsonify("Department ranking report data")
    elif report_type == "course_enrollment_summary":
        # Logic for course enrollment summary
        return jsonify("Course enrollment summary data")
    else:
        return jsonify({"error": f"Unknown report type: {report_type}"}), 400
