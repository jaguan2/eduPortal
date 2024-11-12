# CLI-based advisor-specific actions
# Requirement 2: Advisors can add or drop students from courses if they belong to the same department
# Requirement 2: Advisors are authorized to add or drop students into or out of a course if the advisor and the student's major belong to the same department.
# register_student_in_course, drop_student_from_course
# functions will validate that the advisor’s department matches the student’s department before performing any registration or withdrawal.

# Advisors Can Work Across Multiple Departments
# No restriction here, just a reminder that advisors are permitted to work with students from different departments.

# Students Cannot Take the Same Course Twice in the Same Semester
# enroll_in_course, Add validation in the enrollment function to check for existing registrations within the same semester.

# Students Can Repeat a Course in a Different Semester
# enroll_in_course, Allow enrollments for previously taken courses if the semester differs from prior enrollments.

# Semester Options for Course Enrollment
# enroll_in_course, Restrict enrollments to semesters of spring (S), fall (F), or summer (U).

# Students Can Only Have One Major (and database.py)
# Ensure add_student checks for one major per student in database.py, enforcing this rule on insertions.

# import sqlite3
from src.core.utils import validate_grade, validate_single_enrollment, validate_semester
from src.analytics.gpa_analysis import what_if_gpa, suggest_course_plan, generate_gpa_summary, department_gpa_rankings
from src.core.logger import log_action
from src.auth.auth import authorize_access

class Advisor:
    def __init__(self, user_id, department_id, db_manager):
        self.user_id = user_id
        self.department_id = department_id
        self.role = "advisor"
        self.db_manager = db_manager  # DatabaseManager instance
    
    # Allows the advisor to add a student to a course if the student's major is in the advisor's department.
    # Meets Requirement 2: Advisors can add students to courses only if they belong to the same department.
    # Integrity Constraint: Validates department alignment before allowing enrollment.
    def add_student_to_course(self, student_id, course_id, semester, year, grade):
        if not authorize_access({"role": self.role}, "add", "course_enrollments"):
            print("Access denied.")
            return

        # Verify the student's major is within the advisor's department
        student_major = self.db_manager.get_student_major(student_id)
        if student_major != self.department_id:
            print("Error: Student's major does not match the advisor's department.")
            return

        # Check that the semester is valid
        if not validate_semester(semester):
            print("Error: Invalid semester. Allowed semesters are spring, fall, and summer.")
            return

        # Check that the grade is valid
        if not validate_grade(grade):
            print("Error: Invalid grade. Allowed grades are A, B, C, D, F, I, S, and U.")
            return

        # Ensure single enrollment per course and semester
        if not validate_single_enrollment(self.db_manager.conn, student_id, course_id, semester, year):
            print("Error: Student is already enrolled in this course for the specified semester.")
            return

        # Call add_student_to_course from database.py to perform enrollment
        success = self.db_manager.add_student_to_course(student_id, course_id, semester, year, grade)
        if success:
            log_action(self.user_id, self.role, "Added student to course", f"Student ID: {student_id}, Course ID: {course_id}")
            print(f"Student {student_id} added to course {course_id} for {semester} {year}.")


    # Allows the advisor to drop a student from a course if the student's major is in the advisor's department.
    # Meets Requirement 2: Advisors can drop students from courses only if they belong to the same department.
    # Integrity Constraint: Ensures that the student is in the advisor’s department before unenrollment.
    def drop_student_from_course(self, student_id, course_id, semester, year):
        if not authorize_access({"role": self.role}, "drop", "course_enrollments"):
            print("Access denied.")
            return

        # Verify the student's major is within the advisor's department
        student_major = self.db_manager.get_student_major(student_id)
        if student_major != self.department_id:
            print("Error: Student's major does not match the advisor's department.")
            return

        # Call drop_student_from_course from database.py to handle the unenrollment
        success = self.db_manager.drop_student_from_course(student_id, course_id, semester, year)
        if success:
            log_action(self.user_id, self.role, "Dropped student from course", f"Student ID: {student_id}, Course ID: {course_id}")
            print(f"Student {student_id} dropped from course {course_id}.")

    # Allows the advisor to perform a What-If GPA analysis for a student in their department.
    # Meets Requirement 6: Allows advisors to conduct What-If GPA analysis for students.
    # Integrity Constraint: Verifies that the student is in the advisor’s department before proceeding with analysis.
    def what_if_gpa_for_student(self, student_id, courses):
        if not authorize_access({"role": self.role}, "view", "gpa_analysis"):
            print("Access denied.")
            return

        student_major = self.db_manager.get_student_major(student_id)
        if student_major != self.department_id:
            print("Error: Student's major does not match the advisor's department.")
            return

        # Use `what_if_gpa` from gpa_analysis for GPA projection
        result = what_if_gpa(self.db_manager.get_student_gpa(student_id), self.db_manager.get_student_credits(student_id), courses)
        print(f"Projected GPA for student {student_id}: {result}")
        log_action(self.user_id, self.role, "Performed What-If analysis", f"Student ID: {student_id}, Projected GPA: {result}")

    def suggest_courses_for_student_gpa_target(self, student_id, target_gpa, course_options):
        current_gpa = self.db_manager.get_student_gpa(student_id)
        completed_credits = self.db_manager.get_student_credits(student_id)
        suggestions = suggest_course_plan(current_gpa, completed_credits, target_gpa, course_options)
        print(f"Suggested course plans for student {student_id} to reach GPA {target_gpa}: {suggestions}")

    def view_gpa_summary(self):
        students_by_major = self.db_manager.get_students_by_major()
        summary = generate_gpa_summary(students_by_major)
        print("GPA Summary by Major:", summary)

    def view_department_rankings(self):
        departments = self.db_manager.get_departments_with_student_gpas()
        rankings = department_gpa_rankings(departments)
        print("Department GPA Rankings:", rankings)

    # Closes the database connection
    def close_connection(self):
        self.db_manager.close_connection()
        print("Database connection closed.")