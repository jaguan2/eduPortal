# Refactored admin-specific actions
# Read-only log access for administrators.
# view_log
# Admin-only function in admin.py to view operations.log, ensuring that logs are accessible but cannot be modified.

import sqlite3
from src.core.logger import log_action
from src.auth.auth import authorize_access
from src.analytics.gpa_analysis import course_enrollment_report
import src.analytics.gpa_analysis as gpa_analysis  # Assumes gpa_analysis has necessary report functions
from src.core.database import DatabaseManager 
DATABASE_PATH = "data/eduPortalDB.db"  # Path to the database file

class Admin:
    def __init__(self, user_id, db_manager):
        self.user_id = user_id
        self.role = "admin"
        self.db_manager = db_manager
    
    # Allows the admin to view the log file for audit purposes.
    ## Meets Requirement 5: Admin-only access to view operation logs.
    def view_logs(self):
        try:
            with open("logs/operations.log", "r") as log_file:
                logs = log_file.readlines()
                for line in logs:
                    print(line.strip())
            log_action(self.user_id, self.role, "Viewed logs", "Accessed operation logs for audit.")
        except FileNotFoundError:
            print("Log file not found.")

    # Allows the admin to create a new user with a specified role.
    ## Logs the action and enforces admin-only access.
    def create_user(self, username, password, role):
        if not authorize_access({"role": self.role}, "manage", "user_accounts"):
            print("Access denied.")
            return
        
        query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
        self.conn.execute(query, (username, password, role))
        self.conn.commit()
        log_action(self.user_id, self.role, "Created user", f"Username: {username}, Role: {role}")
        print(f"User '{username}' with role '{role}' created successfully.")

    # Updates the role of an existing user.
    # Logs the action and enforces admin-only access.
    def update_user(self, user_id, new_role):
        if not authorize_access({"role": self.role}, "manage", "user_accounts"):
            print("Access denied.")
            return
        
        query = "UPDATE users SET role = ? WHERE id = ?"
        self.conn.execute(query, (new_role, user_id))
        self.conn.commit()
        log_action(self.user_id, self.role, "Updated user role", f"User ID: {user_id}, New Role: {new_role}")
        print(f"User with ID '{user_id}' role updated to '{new_role}'.")

    # Deletes a user from the system.
    # Logs the action and enforces admin-only access.
    def delete_user(self, user_id):
        if not authorize_access({"role": self.role}, "manage", "user_accounts"):
            print("Access denied.")
            return
        
        query = "DELETE FROM users WHERE id = ?"
        self.conn.execute(query, (user_id,))
        self.conn.commit()
        log_action(self.user_id, self.role, "Deleted user", f"User ID: {user_id}")
        print(f"User with ID '{user_id}' deleted successfully.")

    # Allows the admin to view all records in a specified table (students, courses, instructors, etc.).
    # Logs the action and enforces admin-only access.
    def view_all_records(self, table_name):
        if not authorize_access({"role": self.role}, "view", "all_records"):
            print("Access denied.")
            return
        records = self.db_manager.fetch_all_records(table_name)
        for record in records:
            print(record)
        log_action(self.user_id, self.role, "Viewed all records", f"Table: {table_name}")

    # Allows the admin to generate summary reports for GPA, department rankings, and more.
    # Logs the action and provides admin access to all summary reports.
    def generate_report(self, report_type):
        if not authorize_access({"role": self.role}, "view", "reports"):
            print("Access denied.")
            return

        if report_type == "GPA_summary":
            students_by_major = self.db_manager.get_students_by_major()
            report = gpa_analysis.generate_gpa_summary(students_by_major)
        elif report_type == "department_ranking":
            departments = self.db_manager.get_departments_with_student_gpas()
            report = gpa_analysis.department_gpa_rankings(departments)
        elif report_type == "course_enrollment_summary":
            semester = input("Enter semester for course enrollment report (e.g., 'fall 2023'): ")
            courses_by_semester = self.db_manager.get_courses_by_semester(semester)
            report = course_enrollment_report(courses_by_semester)
        else:
            print(f"Unknown report type: {report_type}")
            return

        print(report)
        log_action(self.user_id, self.role, "Generated report", f"Report type: {report_type}")

    # Close the DatabaseManager connection if needed
    def close_connection(self):
        self.db_manager.close_connection()
