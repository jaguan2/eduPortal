# Database connection and schema initialization logic
# Requirement 4: No duplicate entities (students, instructors, staff, advisors, courses, departments).
# Insertion functions across files (e.g., add_student, add_instructor) will include checks for existing entries.
# Functions to insert data will include validation in database.py or utils.py to check if a record already exists, using unique constraints (like unique usernames or course IDs).
# validate_course_credits, validate_student_id, and integrity checks on insertions.

# Students Can Only Have One Major
# add_student (student.py and database.py) checks for one major per student in database.py, enforcing this rule on insertions.

# DATA INTEGRITY CONSTRAINTS

# Consistent Updates Across References for Course Prefix/Number Changes
# update_course (database.py and staff.py)
# Ensure that updates to course prefix/number propagate to related records.

# Unique Course Identification (Prefix + Number):
# Add a unique constraint to the course table to ensure no duplicate course prefix/number combinations.

import sqlite3
import os
from src.analytics.gpa_analysis import calculate_gpa, calculate_total_credits
from src.core.logger import logger


from src.core.utils import (
    validate_grade,
    validate_student_id,
    validate_course_credits,
    validate_username_uniqueness,
    validate_course_prefix_number_uniqueness,
    validate_course_code
)

# Define the path to the SQLite database
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "../../data/eduPortalDB.db")
DB_SETUP_PATH = os.path.join(os.path.dirname(__file__), "../../data/db_setup.py")

class DatabaseManager:
    def __init__(self, db_path=DATABASE_PATH):
        self.db_path = db_path
        self.conn = None
        self._connect()
        self._initialize_schema()  # Initialize schema on startup

    def _connect(self):
        """Establish a connection to the SQLite database with foreign key support."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.execute("PRAGMA foreign_keys = ON;")  # Enables foreign key constraints
            print("Database connection established.")
            logger.info("Database connection established.")
        except sqlite3.Error as e:
            print(f"Error connecting to database: {e}")
            logger.error(f"Error connecting to database: {e}")

    def _initialize_schema(self):
        """Run schema initialization from db_setup.py if the database is empty."""
        try:
            cursor = self.conn.cursor()
            # Check if the database is already set up by looking for a key table
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='students';")
            if not cursor.fetchone():  # If 'students' table is not found, run setup
                print("Initializing database schema...")
                logger.info("Initialization: Starting database schema setup.")
                with open(DB_SETUP_PATH, 'r') as f:
                    code = f.read()
                    exec(code, globals())  # Run the setup code from db_setup.py
                print("Database schema initialized.")
                logger.info("Initialization: Database schema setup complete.")
            else:
                print("Database schema already exists.")
                logger.info("Initialization: Database schema already exists.")
        except sqlite3.Error as e:
            print(f"Error during schema initialization: {e}")
            logger.error(f"Error during schema initialization: {e}")

    def execute_query(self, query, params=None):
        """Execute a single query with optional parameters and return the cursor."""
        try:
            cursor = self.conn.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            self.conn.commit()
            logger.info(f"Executed query: {query} with params: {params}")
            return cursor
        except sqlite3.Error as e:
            print(f"Error executing query: {e}")
            logger.error(f"Error executing query: {e} - Query: {query} - Params: {params}")
            return None

    def fetch_all(self, query, params=None):
        """Fetch all results from a query with optional parameters."""
        cursor = self.execute_query(query, params)
        return cursor.fetchall() if cursor else []

    def fetch_one(self, query, params=None):
        """Fetch a single result from a query with optional parameters."""
        cursor = self.execute_query(query, params)
        return cursor.fetchone() if cursor else None

    def check_uniqueness(self, table, column, value):
        """Check if a value in a specified column is unique in the given table."""
        query = f"SELECT 1 FROM {table} WHERE {column} = ? LIMIT 1"
        result = self.fetch_one(query, (value,))
        return result is None  # Returns True if unique, False if exists

    # Additional helper function to generate a unique student ID
    def get_next_student_id(self):
        """Generate the next available student ID."""
        result = self.fetch_one("SELECT MAX(id) FROM students")
        max_id = result[0] if result and result[0] is not None else 0
        return max_id + 1
    

    def add_instructor(self, username, department_id):
        """Add an instructor with a unique username."""
        # Validate that the instructor's username is unique
        if not validate_username_uniqueness(self, username, table="instructors"):
            print("Invalid instructor")
            logger.warning("Invalid instructor")
            return None  # Exit if validation fails

        # Proceed to insert instructor if validation passes
        query = "INSERT INTO instructors (username, department) VALUES (?, ?)"
        self.execute_query(query, (username, department_id))
        logger.info(f"Instructor '{username}' added successfully.")
        print(f"Instructor '{username}' added successfully.")


    def update_course_prefix_number(self, course_id, new_prefix, new_number):
        """Update a course prefix and/or number and apply changes to related references."""
        if not self.check_uniqueness("courses", "prefix", new_prefix) or not self.check_uniqueness("courses", "number", new_number):
            logger.error("Validation Error: Duplicate course prefix or number.")
            print("Error: Duplicate course prefix or number.")
            return None
        # Update course prefix and number
        query = "UPDATE courses SET prefix = ?, number = ? WHERE id = ?"
        self.execute_query(query, (new_prefix, new_number, course_id))
        logger.info(f"Update: Course prefix and number updated for course ID {course_id}.")
        print(f"Course with ID {course_id} updated to {new_prefix} {new_number}.")

    # Retrieves courses offered in a specific semester and year, including total enrollments and grades.
    def get_courses_by_semester(self, semester, year):
        logger.info(f"Retrieving courses for semester '{semester}' and year '{year}'.")

        query = """
        SELECT c.id AS course_id, c.courseName, e.student, e.grade
        FROM courses c
        LEFT JOIN taken e ON c.id = e.course
        WHERE c.semester = ? AND c.year = ?
        """
        cursor = self.conn.execute(query, (semester, year))
        courses = {}
        
        for row in cursor.fetchall():
            course_id = row['course_id']
            course_name = row['courseName']
            student_id = row['student']
            grade = row['grade']

            # Initialize entry for each course if it doesn't exist
            if course_id not in courses:
                courses[course_id] = {
                    'course_name': course_name,
                    'enrollments': []
                }

            # Append enrollment data
            if student_id:
                courses[course_id]['enrollments'].append({
                    'student_id': student_id,
                    'grade': grade
                })
        logger.info(f"Courses for semester '{semester}' and year '{year}' retrieved with total courses: {len(courses)}.")
        return courses
    
    # Retrieves a list of students grouped by their major.
    def get_students_by_major(self):
        logger.info("Retrieving list of students grouped by major.")

        query = """
        SELECT s.id, s.username, s.major, AVG(t.grade) AS gpa, SUM(c.credits) AS total_credits
        FROM students s
        LEFT JOIN taken t ON s.id = t.student
        LEFT JOIN courses c ON t.course = c.id
        GROUP BY s.id, s.major
        """
        cursor = self.conn.execute(query)
        students_by_major = {}

        for row in cursor.fetchall():
            major = row["major"]
            student_data = {
                "student_id": row["id"],
                "username": row["username"],
                "gpa": row["gpa"] if row["gpa"] is not None else 0.0,
                "total_credits": row["total_credits"] if row["total_credits"] is not None else 0
            }

            # Group students by major
            if major not in students_by_major:
                students_by_major[major] = []
            students_by_major[major].append(student_data)
        
        logger.info("Students grouped by major retrieved successfully.")

        return students_by_major

    # Retrieves average GPAs for each department based on enrolled students' GPAs.
    def get_departments_with_student_gpas(self):
        logger.info("Retrieving department GPA averages.")

        query = """
        SELECT d.id AS department_id, d.name AS department_name, AVG(t.grade) AS average_gpa
        FROM departments d
        JOIN students s ON s.major = d.id
        LEFT JOIN taken t ON s.id = t.student
        LEFT JOIN courses c ON t.course = c.id
        GROUP BY d.id
        """
        cursor = self.conn.execute(query)
        departments_with_gpa = {}

        for row in cursor.fetchall():
            department_id = row["department_id"]
            departments_with_gpa[department_id] = {
                "department_name": row["department_name"],
                "average_gpa": row["average_gpa"] if row["average_gpa"] is not None else 0.0
            }
        
        logger.info("Department GPA averages retrieved successfully.")
        return departments_with_gpa
    
    # Adds a new student to the database with validations on unique username and valid student ID.
    # Meets Requirement 4: No duplicate entities and Requirement 3: Student ID format validation.
    def add_student(self, username, password, major_id):
        """Add a student with validations on username and student ID format."""
        # Ensure the username is unique in the students table
        if not validate_username_uniqueness(self, username, table="students"):
            logger.error(f"Error: Username '{username}' already exists in 'students' table.")
            print(f"Username '{username}' already exists in 'students' table.")
            return None  # Exit if validation fails

        # Check student ID format if it's generated or available (modify as per requirements)
        student_id = "U" + str(self.get_next_student_id())  # Example generation of student ID
        if not validate_student_id(student_id):
            logger.error(f"Error: Invalid student ID format: {student_id}")
            print(f"Invalid student ID format: {student_id}")
            return None  # Exit if validation fails

        # Proceed to insert the student if all validations pass
        query = "INSERT INTO students (username, password, major) VALUES (?, ?, ?)"
        self.execute_query(query, (username, password, major_id))
        logger.info(f"Student '{username}' added successfully with ID '{student_id}'.")
        print(f"Student '{username}' added successfully with ID '{student_id}'.")
        
    # Adds a new course to the database with validations on unique course prefix/number and valid course credits.
    # Meets Requirement 4: No duplicate course prefix/number combinations.
    def add_course(self, prefix, number, course_name, credits, semester, year, class_time, class_day, instructor_id):
        """Add a course to the database with validations on credits and course uniqueness."""
        # Validate course credits
        if not validate_course_credits(credits):
            logger.error(f"Error: Invalid course credits: {credits}. Must be between 1 and 4.")
            print(f"Error: Invalid course credits: {credits}. Must be between 1 and 4.")
            return None  # Exit if validation fails

        # Check that the course prefix and number are unique
        if not validate_course_prefix_number_uniqueness(self, prefix, number):
            logger.error(f"Error: Duplicate course prefix and number combination: {prefix} {number}.")
            print(f"Error: Duplicate course prefix and number combination: {prefix} {number}.")
            return None  # Exit if validation fails
        
        # Validate course code format (e.g., 'CS1010')
        if not validate_course_code(prefix, number):
            logger.error(f"Error: Invalid course code format: {prefix} {number}")
            print(f"Error: Invalid course code format: {prefix} {number}")
            return None  # Exit if validation fails

        # Proceed to insert the course if all validations pass
        query = "INSERT INTO courses (prefix, number, courseName, credits, semester, year, classTime, classDay, instructor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        self.execute_query(query, (prefix, number, course_name, credits, semester, year, class_time, class_day, instructor_id))
        logger.info(f"Course '{prefix} {number}' added successfully.")
        print(f"Course '{prefix} {number}' added successfully.")

    # Enrolls a student in a course with grade validation, ensuring only valid grades are used.
    # Meets Requirement 6: Grade validation for enrollments.
    def enroll_student_in_course(self, student_id, course_id, grade):
        """Enroll a student in a course with grade validation."""
        # Validate the grade
        if not validate_grade(grade):
            logger.error(f"Error: Invalid grade: {grade}")
            print(f"Error: Invalid grade: {grade}")
            return None  # Exit if validation fails

        # Proceed to insert enrollment if validation passes
        query = "INSERT INTO taken (student, course, grade) VALUES (?, ?, ?)"
        self.execute_query(query, (student_id, course_id, grade))
        logger.info(f"Student '{student_id}' enrolled in course '{course_id}' with grade '{grade}'.")
        print(f"Student '{student_id}' enrolled in course '{course_id}' with grade '{grade}'.")

    # Updates course details, including validations on credits and unique course prefix/number combinations.
    # Meets Requirement 7: Consistent updates across course references.
    def update_course(self, course_id, prefix=None, number=None, credits=None):
        """Update a course with validations on credits and unique prefix/number."""
        # Validate course credits if provided
        if credits is not None and not validate_course_credits(credits):
            logger.error(f"Error: Course '{course_id}' does not contain valid course credits.")
            return None  # Exit if validation fails

        # Check that prefix and number are unique if provided
        if prefix and number and not validate_course_prefix_number_uniqueness(self, prefix, number):
            logger.error(f"Error: Duplicate course prefix and number combination: {prefix} {number}.")
            return None  # Exit if validation fails

        # Update the course with valid data
        query = "UPDATE courses SET prefix = ?, number = ?, credits = ? WHERE id = ?"
        self.execute_query(query, (prefix, number, credits, course_id))
        logger.info(f"Course with ID '{course_id}' updated successfully.")
        print(f"Course with ID '{course_id}' updated successfully.")

    # Updates a student’s major with validation on the student ID format.
    # Ensures only valid student IDs are processed (Requirement 3).
    def update_student_major(self, student_id, major_id):
        """Update a student's major with a valid student ID format check."""
        # Validate the student ID format before updating
        if not validate_student_id(student_id):
            logger.error(f"Error: Student with ID '{student_id}' has invalid ID format.")
            return None  # Exit if validation fails

        # Update student's major if validation passes
        query = "UPDATE students SET major = ? WHERE id = ?"
        self.execute_query(query, (major_id, student_id))
        logger.info(f"Student '{student_id}' major updated to '{major_id}' successfully.")
        print(f"Student '{student_id}' major updated to '{major_id}' successfully.")

    # Updates the grade for a student's enrollment in a course, validating the grade input.
    # Meets Requirement 6: Only valid grades are used.
    def update_enrollment_grade(self, student_id, course_id, grade):
        """Update a student's grade for a course with grade validation."""
        # Validate the grade before updating
        if not validate_grade(grade):
            logger.error(f"Error: Invalid grade: {grade}")
            return None  # Exit if validation fails

        # Update the grade in the enrollment record if validation passes
        query = "UPDATE taken SET grade = ? WHERE student = ? AND course = ?"
        self.execute_query(query, (grade, student_id, course_id))
        logger.info(f"Grade for student '{student_id}' in course '{course_id}' updated to '{grade}'.")
        print(f"Grade for student '{student_id}' in course '{course_id}' updated to '{grade}'.")

    # Attempts to delete a course with validation to prevent deletion if enrollments exist.
    # Meets Referential Integrity requirement: No course deletions if referenced.
    def delete_course(self, course_id):
        """Attempt to delete a course and prevent deletion if it has enrollments."""
        # Check if the course has enrollments
        enrollments = self.fetch_one("SELECT 1 FROM taken WHERE course = ? LIMIT 1", (course_id,))
        if enrollments:
            logger.error("Error: Cannot delete course as it has enrollments.")
            print("Error: Cannot delete course as it has enrollments.")
            return None
        # If no enrollments, proceed to delete
        query = "DELETE FROM courses WHERE id = ?"
        self.execute_query(query, (course_id,))
        logger.info("Course with ID {course_id} deleted successfully.")
        print(f"Course with ID {course_id} deleted successfully.")

    # Attempts to delete a student with validation to prevent deletion if the student has enrollments.
    # Meets Referential Integrity requirement: No student deletions if referenced.
    def delete_student(self, student_id):
        """
        Attempts to delete a student with validation to prevent deletion if the student has enrollments.
        Meets Referential Integrity requirement: No student deletions if referenced.
        """
        # Check if the student is referenced in the taken (enrollments) table
        enrollments = self.fetch_one("SELECT 1 FROM taken WHERE student = ? LIMIT 1", (student_id,))
        if enrollments:
            logger.error(f"Error: Cannot delete student '{student_id}' as they are enrolled in courses.")
            print(f"Error: Cannot delete student '{student_id}' as they are enrolled in courses.")
            return None

        # Proceed with deletion if no enrollments found
        query = "DELETE FROM students WHERE id = ?"
        self.execute_query(query, (student_id,))
        logger.info(f"Student with ID '{student_id}' deleted successfully.")
        print(f"Student with ID '{student_id}' deleted successfully.")

    # Adds a student to a course with core checks for valid enrollment (no duplicates).
    # Meets Requirement 2: Advisors can add students to courses only if they belong to the same department.
    # Integrity Constraint: Prevents duplicate enrollments by checking for existing records in the same semester.
    def add_student_to_course(self, student_id, course_id, semester, year):
        query = "SELECT * FROM taken WHERE student = ? AND course = ? AND semester = ? AND year = ?"
        cursor = self.conn.execute(query, (student_id, course_id, semester, year))
        if cursor.fetchone():
            logger.error(f"Error: Student with ID '{student_id}' is already enrollment in this course for the specific semester.")
            print(f"Error: Student with ID '{student_id}' is already enrollment in this course for the specific semester.")
            return False

        query = "INSERT INTO taken (student, course, semester, year) VALUES (?, ?, ?, ?)"
        self.conn.execute(query, (student_id, course_id, semester, year))
        self.conn.commit()
        logger.info(f"Student with ID '{student_id}' successfully enrolled in course ID '{course_id}' for semester '{semester}' {year}.")
        print(f"Student with ID '{student_id}' successfully enrolled in course ID '{course_id}' for semester '{semester}' {year}.")
        return True

    # Drops a student from a course with core checks for valid unenrollment.
    # Meets Requirement 2: Advisors can drop students from courses only if they belong to the same department.
    # Integrity Constraint: Ensures valid unenrollment by checking that the student is enrolled before removal.
    def drop_student_from_course(self, student_id, course_id, semester, year):
        query = "SELECT * FROM taken WHERE student = ? AND course = ? AND semester = ? AND year = ?"
        cursor = self.conn.execute(query, (student_id, course_id, semester, year))
        if not cursor.fetchone():
            print("Error: Student is not enrolled in this course for the specified semester.")
            return False

        query = "DELETE FROM taken WHERE student = ? AND course = ? AND semester = ? AND year = ?"
        self.conn.execute(query, (student_id, course_id, semester, year))
        self.conn.commit()
        return True

    # Conducts a What-If GPA calculation given a list of hypothetical courses.
    # Meets Requirement 6: Allows students and advisors to simulate GPA scenarios.
    # GPA Integrity: Assumes standard GPA formula and grade-to-point mapping.
    def what_if_gpa(self, student_id, courses):
        # Example course structure: [{'credits': 3, 'grade': 'A'}, {'credits': 4, 'grade': 'B'}, ...]
        total_credits = sum(course['credits'] for course in courses)
        total_points = sum(self.grade_to_points(course['grade']) * course['credits'] for course in courses)
        projected_gpa = total_points / total_credits if total_credits > 0 else 0.0
        return projected_gpa

    # Calculate and return the current GPA of the student.
    def get_student_gpa(self, student_id):
        query = """
        SELECT AVG(
            CASE taken.grade 
                WHEN 'A' THEN 4 
                WHEN 'B' THEN 3 
                WHEN 'C' THEN 2 
                WHEN 'D' THEN 1 
                ELSE 0 END
            ) as gpa
        FROM taken
        JOIN courses ON taken.course = courses.id
        WHERE taken.student = ?
        """
        result = self.fetch_one(query, (student_id,))
        gpa = result[0] if result and result[0] is not None else 0.0

        # Log the GPA calculation result
        logger.info(f"Calculated GPA for student ID '{student_id}': {gpa:.2f}")

        # Log a warning if GPA is 0.0, indicating no valid grades or no enrolled courses
        if gpa == 0.0:
            logger.warning(f"GPA for student ID '{student_id}' is 0.0, which may indicate no grades or enrollments.")
        
        return gpa

    # Calculate and return the total credits completed by the student.
    def get_student_credits(self, student_id):
        query = """
        SELECT SUM(courses.credits) 
        FROM taken
        JOIN courses ON taken.course = courses.id
        WHERE taken.student = ? AND taken.grade IN ('A', 'B', 'C', 'D', 'S')
        """
        result = self.fetch_one(query, (student_id,))
        total_credits = result[0] if result and result[0] is not None else 0

        # Log the credits calculation result
        logger.info(f"Calculated total completed credits for student ID '{student_id}': {total_credits}")

        # Log a warning if credits are 0, indicating no passing grades
        if total_credits == 0:
            logger.warning(f"Total completed credits for student ID '{student_id}' is 0, which may indicate no passing grades or completed courses.")
        
        return total_credits

    
    # Gets the department of a student, used to enforce advisor's department-based enrollment restrictions.
    # Meets Requirement 2: Ensures advisors can only enroll or drop students in their own department.
    def get_student_major(self, student_id):
        query = "SELECT major FROM students WHERE id = ?"
        cursor = self.conn.execute(query, (student_id,))
        result = cursor.fetchone()
        
        # Check if a major was found and log the appropriate message
        if result:
            major = result[0]
            logger.info(f"Retrieved major for student ID '{student_id}': Major ID {major}")
        else:
            major = None
            logger.warning(f"Student ID '{student_id}' does not exist or has no assigned major.")
        
        return major


    # Gets the department of an instructor, used to enforce staff’s department-based constraints.
    # Meets Requirement 1: Ensures staff can only assign instructors to courses within their own department.
    def get_instructor_department(self, instructor_id):
        query = "SELECT department FROM instructors WHERE id = ?"
        cursor = self.conn.execute(query, (instructor_id,))
        result = cursor.fetchone()
        
        # Check if a department was found and log the appropriate message
        if result:
            department = result[0]
            logger.info(f"Retrieved department for instructor ID '{instructor_id}': Department ID {department}")
        else:
            department = None
            logger.warning(f"Instructor ID '{instructor_id}' does not exist or has no assigned department.")
        
        return department

    # Checks if a course has active enrollments, used to enforce deletion constraints.
    # Integrity Constraint: Prevents deletion of courses that have active enrollments.
    def course_has_enrollments(self, course_id):
        query = "SELECT * FROM taken WHERE course = ?"
        cursor = self.conn.execute(query, (course_id,))
        has_enrollments = cursor.fetchone() is not None

        # Log the result of the check
        if has_enrollments:
            logger.info(f"Course ID '{course_id}' has active enrollments. Deletion restricted.")
        else:
            logger.info(f"Course ID '{course_id}' has no active enrollments. Deletion permitted.")
        
        return has_enrollments

    
    def close_connection(self):
        """Close the database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed successfully.")
            print("Database connection closed.")
        else:
            logger.warning("Attempted to close a connection that was already closed or not initialized.")

# Create a singleton instance of DatabaseManager
db_manager = DatabaseManager()

# Example usage:
# db_manager.add_student("user1", "pass1", 1)  # Adds a new student if username is unique
# db_manager.delete_course(5)                 # Deletes course if no enrollments exist
# db_manager.update_course_prefix_number(3, "CS", 101)  # Updates course prefix and number if unique
# db_manager.close_connection()
