# tests/test_user_roles_access.py
# python -m unittest discover tests

import unittest
import subprocess
import os
import sqlite3
from unittest.mock import patch, ANY  # Importing ANY for placeholder use
from src.users.student import Student
from src.users.advisor import Advisor
from src.users.staff import Staff
from src.users.admin import Admin
from src.core.database import DatabaseManager
from src.auth.auth import authorize_access
from src.core.logger import log_action  # Ensure function for logging is imported

RESET_DB_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../data/reset_database.py")

class TestUserRolesAccess(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Initialize the DatabaseManager and user roles for testing
        subprocess.run(['python', RESET_DB_SCRIPT_PATH], check=True)
        cls.db_manager = DatabaseManager()
        
        # Create test instances for different user roles
        cls.student = Student(user_id=1)
        cls.advisor = Advisor(user_id=2, department_id=1)
        cls.staff = Staff(user_id=3, department_id=1)
        cls.admin = Admin(user_id=4)

    def test_student_view_own_data(self):
        can_view = authorize_access({"role": self.student.role}, "view", "student_data")
        self.assertTrue(can_view, "Student should be able to view their own data")

    def test_student_cannot_modify_own_data(self):
        can_modify = authorize_access({"role": self.student.role}, "modify", "student_data")
        self.assertFalse(can_modify, "Student should not be able to modify their own data")

    def test_advisor_add_student_to_course_same_department(self):
        can_add = authorize_access({"role": self.advisor.role}, "add", "course_enrollments")
        self.assertTrue(can_add, "Advisor should be able to add students to courses in their department")

    def test_advisor_cannot_modify_courses_outside_department(self):
        can_modify = authorize_access({"role": self.advisor.role}, "modify", "other_department_courses")
        self.assertFalse(can_modify, "Advisor should not be able to modify courses outside their department")

    def test_staff_can_add_course_in_own_department(self):
        can_add_course = authorize_access({"role": self.staff.role}, "add", "department_data")
        self.assertTrue(can_add_course, "Staff should be able to add courses within their department")

    def test_staff_cannot_add_course_in_other_department(self):
        original_department = self.staff.department_id
        self.staff.department_id = 2  # Simulate a different department
        can_add_course = authorize_access({"role": self.staff.role}, "add", "department_data")
        self.assertFalse(can_add_course, "Staff should not be able to add courses in other departments")
        self.staff.department_id = original_department  # Reset to original


    def test_admin_can_view_all_records(self):
        can_view_all = authorize_access({"role": self.admin.role}, "view", "all_records")
        self.assertTrue(can_view_all, "Admin should be able to view all records")

    def test_admin_can_manage_users(self):
        can_manage_users = authorize_access({"role": self.admin.role}, "manage", "user_accounts")
        self.assertTrue(can_manage_users, "Admin should be able to manage user accounts")

    def test_admin_cannot_add_course_directly(self):
        can_add_course = authorize_access({"role": self.admin.role}, "add", "courses")
        self.assertFalse(can_add_course, "Admin should not directly add courses if role-based delegation is enforced")

    @patch("src.core.logger.log_action")  # Mocking the log_action function
    def test_access_restrictions_logging(self, mock_log_action):
        can_modify = authorize_access({"role": "student"}, "modify", "student_data")
        
        self.assertFalse(can_modify, "Student should not be able to modify their own data")
        
        mock_log_action.assert_called_once_with(
            ANY,  # Placeholder for user_id
            "student",
            "Access Denied",
            "Attempted unauthorized modification"
        )

    @classmethod
    def tearDownClass(cls):
        # Clean up database connections
        cls.db_manager.close_connection()

if __name__ == "__main__":
    unittest.main()
