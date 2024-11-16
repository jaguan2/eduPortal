import sqlite3
from flask import Flask, jsonify, request

@app.route('/api/admin/logs', methods=['GET'])
def fetch_logs():
    """
    Fetches all logs from the logs table for admin review.
    """
    conn = sqlite3.connect('eduPortalDB.db')
    cursor = conn.cursor()
    cursor.execute('SELECT timestamp, user, role, action FROM logs ORDER BY id DESC')
    logs = [{"timestamp": row[0], "user": row[1], "role": row[2], "action": row[3]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(logs)

@app.route('/api/admin/logs', methods=['GET'])
def view_logs():
    try:
        with open("logs/operations.log", "r") as log_file:
            logs = [{"timestamp": line.split(" - ")[0], "action": line.split(" - ")[1], "details": line.split(" - ")[2].strip()}
                    for line in log_file.readlines()]
        return jsonify(logs)
    except FileNotFoundError:
        return jsonify({"error": "Log file not found"}), 404

@app.route('/api/admin/records/<string:table_name>', methods=['GET'])
def view_all_records(table_name):
    conn = sqlite3.connect("data/eduPortalDB.db")
    cursor = conn.cursor()
    try:
        query = f"SELECT * FROM {table_name}"
        records = cursor.execute(query).fetchall()
        conn.close()
        return jsonify([{"id": row[0], "name": row[1], "details": str(row[2:])} for row in records])
    except sqlite3.OperationalError:
        conn.close()
        return jsonify({"error": f"Table '{table_name}' does not exist"}), 400

@app.route('/api/admin/create_user', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    role = data.get('role')

    # Perform user creation logic here
    log_action("admin", "admin", f"Created user {username} with role {role}")
    return jsonify({"success": True, "message": f"User {username} created successfully"})
