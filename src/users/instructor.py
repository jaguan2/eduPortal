# Refactored instructor-specific actions 
# Requirement 3: Students and instructors can view only their own data.
# view_instructor_courses
# Implement queries to filter data based on the user’s ID, ensuring data visibility restrictions. Only data related to the authenticated student or instructor will be accessible.

import sqlite3
from src.core.logger import log_data_viewed
from src.auth.auth import authorize_access

class Instructor:
    def __init__(self, user_id, db_manager):
        self.user_id = user_id
        self.role = "instructor"
        self.db_manager = db_manager
    
    # Allows the instructor to view details of courses they are assigned to teach.
    # Meets Requirement 3: Restricts instructors to view only their own course data.
    def view_courses(self):
        if not authorize_access({"role": self.role}, "view", "courses_teaching"):
            print("Access denied.")
            return

        # Query for courses the instructor is assigned to teach
        query = "SELECT * FROM courses WHERE instructor = ?"
        cursor = self.conn.execute(query, (self.user_id,))
        courses = cursor.fetchall()
        
        if courses:
            print("Courses you are teaching:")
            for course in courses:
                print(course)
                log_data_viewed(self.user_id, self.role, "course", course[0])  # Assuming course[0] is the course ID
        else:
            print("You are not assigned to any courses.")

    # Allows the instructor to view a list of students enrolled in a specific course they teach.
    # Meets Requirement 3: Restricts instructors to view only student data for their assigned courses.
    def view_students_in_course(self, course_id):
        if not authorize_access({"role": self.role}, "view", "students_enrolled"):
            print("Access denied.")
            return

        # Verify the instructor is assigned to this course
        query = "SELECT * FROM courses WHERE id = ? AND instructor = ?"
        cursor = self.conn.execute(query, (course_id, self.user_id))
        course = cursor.fetchone()
        
        if not course:
            print("You are not assigned to this course.")
            return

        # Query for students enrolled in the course
        query = """
        SELECT students.id, students.username, students.major
        FROM students
        JOIN taken ON students.id = taken.student
        WHERE taken.course = ?
        """
        cursor = self.conn.execute(query, (course_id,))
        students = cursor.fetchall()
        
        if students:
            print(f"Students enrolled in course {course_id}:")
            for student in students:
                print(student)
                log_data_viewed(self.user_id, self.role, "student", student[0])  # Assuming student[0] is the student ID
        else:
            print(f"No students are currently enrolled in course {course_id}.")