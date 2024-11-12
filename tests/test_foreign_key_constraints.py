# tests/test_foreign_key_constraints.py
# python -m unittest discover tests

import unittest
import subprocess
import os
import sqlite3

RESET_DB_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../data/reset_database.py")

class TestDatabaseOperations(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Connect to the database before running tests
        subprocess.run(['python', RESET_DB_SCRIPT_PATH], check=True)
        cls.conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), "../data/eduPortalDB.db"))
        cls.cursor = cls.conn.cursor()

    def setUp(self):
        # Reset the database state before each test if necessary
        pass

    def test_enrollment_and_cascading_deletion(self):
        """Test enrolling a student in a course and verify cascading deletion."""
        # Add a student and a course, then enroll the student in the course
        self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("user1", "pass1", 1))
        student_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO courses (prefix, number, courseName, credits, semester, year, classTime, classDay, instructor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            ("CSE", 1010, "Intro to CS", 3, "F", 2023, "10:00", "M", 1))
        course_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO taken (student, course, grade) VALUES (?, ?, ?)", (student_id, course_id, "A"))
        self.conn.commit()

        # Delete the student and verify cascading deletion in "taken" table
        self.cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
        self.conn.commit()

        # Verify student deletion
        self.cursor.execute("SELECT * FROM students WHERE id = ?", (student_id,))
        self.assertIsNone(self.cursor.fetchone(), "Student record should be deleted")

        # Verify cascading deletion in enrollment
        self.cursor.execute("SELECT * FROM taken WHERE student = ?", (student_id,))
        self.assertIsNone(self.cursor.fetchone(), "Enrollment record should be deleted due to ON DELETE CASCADE")

    def test_reject_invalid_foreign_key(self):
        """Test that inserting a student with a non-existent major is prevented."""
        with self.assertRaises(sqlite3.IntegrityError):
            self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("user2", "pass2", 999))
            self.conn.commit()

    def test_restrict_deletion_of_course_with_enrollments(self):
        """Test that deleting a course with active enrollments is restricted."""
        # Add a student and course, then enroll the student in the course
        self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("user3", "pass3", 1))
        student_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO courses (prefix, number, courseName, credits, semester, year, classTime, classDay, instructor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            ("CSE", 1020, "Advanced CS", 3, "S", 2024, "11:00", "W", 1))
        course_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO taken (student, course, grade) VALUES (?, ?, ?)", (student_id, course_id, "B"))
        self.conn.commit()

        # Attempt to delete the course with active enrollments and verify restriction
        with self.assertRaises(sqlite3.IntegrityError):
            self.cursor.execute("DELETE FROM courses WHERE id = ?", (course_id,))
            self.conn.commit()

    def tearDown(self):
        # Clean up test data to maintain test isolation
        self.cursor.execute("DELETE FROM taken WHERE student IS NOT NULL")
        self.cursor.execute("DELETE FROM students WHERE username IN ('user1', 'user2', 'user3')")
        self.cursor.execute("DELETE FROM courses WHERE prefix IN ('CSE')")
        self.conn.commit()

    @classmethod
    def tearDownClass(cls):
        # Close the database connection after all tests
        cls.conn.close()

if __name__ == "__main__":
    unittest.main()
