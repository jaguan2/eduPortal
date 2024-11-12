# CLI-based student-specific actions
# Requirement 3: Students and instructors can view only their own data.
# view_student_data
# Implement queries to filter data based on the user’s ID, ensuring data visibility restrictions. Only data related to the authenticated student or instructor will be accessible.
# Requirement 3: Students are authorized to view information or read data that is related to them only. 

import sqlite3
from src.analytics.gpa_analysis import what_if_gpa  # Importing from gpa_analysis instead of database
from src.core.logger import log_data_viewed, log_action
from src.auth.auth import authorize_access
import src.analytics.gpa_analysis as suggest_course_plan  # Assume necessary GPA analysis functions exist
# from src.core.database import DatabaseManager
DATABASE_PATH = "data/eduPortalDB.db"  # Path to the database file

class Student:
    def __init__(self, user_id, db_manager):
        self.user_id = user_id
        self.role = "student"
        self.db_manager = db_manager  # Use DatabaseManager instance instead of direct connection
    
    # Allows the student to view their own data only.
    # Meets Requirement 3: Restricts data access to personal information.
    def view_personal_data(self):
        if not authorize_access({"role": self.role}, "view", "student_data"):
            print("Access denied.")
            return

        query = "SELECT * FROM students WHERE id = ?"
        # Use db_manager to execute the query
        personal_data = self.db_manager.execute_query(query, (self.user_id,))
        if personal_data:
            print("Personal Data:", personal_data)
            log_data_viewed(self.user_id, self.role, "student", self.user_id)
        else:
            print("No personal data found.")
    
    # Performs a What-If GPA analysis based on hypothetical course completions.
    # Meets Requirement 6: Provides a GPA projection based on potential scenarios.
    def what_if_gpa(self, courses):
        current_gpa = self.db_manager.get_student_gpa(self.user_id)
        completed_credits = self.db_manager.get_student_credits(self.user_id)
        result = what_if_gpa(current_gpa, completed_credits, courses)
        print(f"Projected GPA: {result}")
        log_action(self.user_id, self.role, "Performed What-If analysis", "Projected GPA based on hypothetical courses.")

    def suggest_courses_for_target_gpa(self, target_gpa, course_options):
        current_gpa = self.db_manager.get_student_gpa(self.user_id)
        completed_credits = self.db_manager.get_student_credits(self.user_id)
        suggestions = suggest_course_plan(current_gpa, completed_credits, target_gpa, course_options)
        print(f"Suggested course plans to reach GPA {target_gpa}: {suggestions}")

