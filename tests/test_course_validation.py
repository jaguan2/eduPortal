# tests/test_course_validation.py
# python -m unittest discover tests

import unittest
import subprocess
import os
import sqlite3
from src.core.database import DatabaseManager
from src.core.utils import validate_course_code, validate_course_credits

RESET_DB_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../data/reset_database.py")
                                    
class TestCourseValidation(unittest.TestCase):
    def setUp(self):
        # Setup like initializing DatabaseManager instance if needed
        subprocess.run(['python', RESET_DB_SCRIPT_PATH], check=True)
        self.db_manager = DatabaseManager()

    def test_valid_course_code(self):
        # Test valid course code
        self.assertTrue(validate_course_code("CSE", "1010"))

    def test_invalid_course_code_prefix(self):
        # Test invalid prefix (less than 3 letters)
        self.assertFalse(validate_course_code("CS", "1010"))

        # Test invalid prefix (more than 3 letters)
        self.assertFalse(validate_course_code("CSEE", "1010"))

        # Test invalid prefix (not uppercase)
        self.assertFalse(validate_course_code("cs", "1010"))

    def test_invalid_course_code_number(self):
        # Test invalid number (less than 4 digits)
        self.assertFalse(validate_course_code("CS", "101"))

        # Test invalid number (more than 4 digits)
        self.assertFalse(validate_course_code("CS", "10100"))

    def test_database_add_course_with_invalid_code(self):
        # Specify the logger to capture logs from the logger set up in your code
        with self.assertLogs('root', level='INFO') as cm:
            self.db_manager.add_course("CSE", "101", "Intro to CS", 3, "F", 2023, "10:00", "M", 1)
            # Confirm log contains the expected message
            self.assertTrue(
                any("Error: Course code must have a 3-letter prefix followed by a 4-digit number" in message for message in cm.output),
                "Expected error message not found in logs."
            )

    def test_credit_hours_range(self):
        self.assertTrue(validate_course_credits(3), "Valid credit hours within 1-4 should pass.")
        self.assertFalse(validate_course_credits(5), "Credit hours above 4 should fail.")

if __name__ == "__main__":
    unittest.main()
