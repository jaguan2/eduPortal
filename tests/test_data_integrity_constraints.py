# test/test_data_integrity_constraints.py
# python -m unittest discover tests
import unittest
import subprocess
import os
import sqlite3

RESET_DB_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../data/reset_database.py")

class TestDataIntegrityConstraints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        subprocess.run(['python', RESET_DB_SCRIPT_PATH], check=True)
        cls.conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), "../data/eduPortalDB.db"))
        cls.cursor = cls.conn.cursor()

    def test_delete_cascade_student(self):
        # Add a student and a course, then enroll the student in the course
        self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("student_cascade", "pass", 1))
        student_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO courses (prefix, number, courseName, credits, semester, year, classTime, classDay, instructor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            ("CSE", 1010, "Intro to CS", 3, "F", 2023, "10:00", "M", 1))
        course_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO taken (student, course, grade) VALUES (?, ?, ?)", (student_id, course_id, "A"))
        self.conn.commit()
        
        # Delete the student and check cascading deletion in "taken" table
        self.cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
        self.conn.commit()
        
        self.cursor.execute("SELECT * FROM taken WHERE student = ?", (student_id,))
        result = self.cursor.fetchone()
        self.assertIsNone(result, "Enrollment record should be deleted with ON DELETE CASCADE for student")

    def test_delete_restrict_course(self):
        # Add a student and a course, then enroll the student in the course
        self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("student_restrict", "pass", 1))
        student_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO courses (prefix, number, courseName, credits, semester, year, classTime, classDay, instructor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            ("CSE", 1020, "Advanced CS", 3, "S", 2024, "11:00", "W", 1))
        course_id = self.cursor.lastrowid
        self.cursor.execute("INSERT INTO taken (student, course, grade) VALUES (?, ?, ?)", (student_id, course_id, "B"))
        self.conn.commit()
        
        # Attempt to delete the course with active enrollments (should fail)
        with self.assertRaises(sqlite3.IntegrityError):
            self.cursor.execute("DELETE FROM courses WHERE id = ?", (course_id,))
            self.conn.commit()

    def test_department_deletion_cascade(self):
        # Add department and major, then delete department and check cascade
        self.cursor.execute("INSERT INTO department (id, departmentName) VALUES (?, ?)", (1, "Engineering"))
        self.cursor.execute("INSERT INTO major (majorName, department) VALUES (?, ?)", ("Computer Science", 1))
        self.conn.commit()
        self.cursor.execute("DELETE FROM department WHERE id = ?", (1,))
        self.conn.commit()
        
        self.cursor.execute("SELECT * FROM major WHERE department = ?", (1,))
        result = self.cursor.fetchone()
        self.assertIsNone(result, "Major records should be deleted on department deletion if ON DELETE CASCADE is active")

    def test_duplicate_student_prevention(self):
        # Ensure duplicate usernames are not allowed
        self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("unique_user", "pass", 1))
        self.conn.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("unique_user", "pass2", 1))
            self.conn.commit()

    def test_foreign_key_constraint(self):
        # Attempt to add a student with a non-existent major
        with self.assertRaises(sqlite3.IntegrityError):
            self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("invalid_major_student", "pass", 999))
            self.conn.commit()

    def test_unique_constraint(self):
        # Add a student with a unique username
        self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("unique_user", "pass", 1))
        self.conn.commit()
        
        # Attempt to add another student with the same username
        with self.assertRaises(sqlite3.IntegrityError):
            self.cursor.execute("INSERT INTO students (username, password, major) VALUES (?, ?, ?)", ("unique_user", "pass", 1))
            self.conn.commit()

    @classmethod
    def tearDownClass(cls):
        # Clean up any test data
        cls.cursor.execute("DELETE FROM students WHERE username IN ('student_cascade', 'student_restrict', 'invalid_major_student', 'unique_user')")
        cls.cursor.execute("DELETE FROM courses WHERE prefix = 'CSE'")
        cls.cursor.execute("DELETE FROM department WHERE departmentName = 'Engineering'")
        cls.conn.commit()
        
        # Close the connection
        cls.conn.close()

if __name__ == "__main__":
    unittest.main()
