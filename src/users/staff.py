# CLI-based staff-specific actions
# Requirement 1: Staff users can add, remove, or modify data (courses, instructors, students, department data).
# add_course, remove_student, update_department
# functions will connect to the database to perform CRUD operations, ensuring data consistency with other staff members’ department-specific limitations.

# COURSE CONSTRAINTS
# Course Credits Between 1 and 4 (and utils.py)
# validate_course_credits
# Ensure credit hours are within the 1–4 range when adding or updating course records.

# No Prerequisites for Courses
# No specific function required, just a constraint to avoid implementing prerequisite functionality.

# Courses May Be Taught in Multiple Semesters
#  Allow course assignments across different semesters, so no restrictions are necessary here.

# Courses Can Exist Without Enrollments
# Courses can be added without enrolled students, so no validation required here.

# Courses May Not Be Taught Every Semester
# No specific constraint required, just a reminder that instructors might not teach in every semester.

# DEPARTMENT CONSTRAINTS
# Every Department Must Offer At Least One Major
# add_department
# Require at least one major to be associated with a department when adding a new department.

# Departments Can Share Building but Not Office
# add_department
# Enforce unique office assignments per department while allowing shared building names.

# STAFF CONSTRAINTS
# Staff Cannot Work Across Multiple Departments
# Ensure that staff members are limited to working within a single department during their assignment.

# DATA INTEGRITY
# Consistent Updates Across References for Course Prefix/Number Changes
# update_course (database.py and staff.py)
# Ensure that updates to course prefix/number propagate to related records.


# Instructor Can Only Teach Courses in One Department
# assign_course_to_instructor
#  Ensure that instructors are only assigned courses from their department when assigning new courses.

# Instructor Cannot Teach the Same Course Twice in the Same Semester
# assign_course_to_instructor
# Check for existing assignments for the same course and semester before assigning a new one.

# No Overlapping Class Times for Instructors in the Same Semester
# assign_course_to_instructor
#  Implement validation to prevent assigning courses with overlapping class times within the same semester.

# Instructor Cannot Exceed 12 Credit Hours per Semester
# assign_course_to_instructor
#  Calculate and check total credit hours assigned before adding a new course for an instructor.

# import sqlite3
from src.core.utils import check_credit_hour_limit, check_overlapping_class_times
from src.core.logger import log_action
from src.auth.auth import authorize_access
from src.analytics.gpa_analysis import course_enrollment_report

DATABASE_PATH = "data/eduPortalDB.db"  # Path to the database file

class Staff:
    def __init__(self, user_id, department_id, db_manager):
        self.user_id = user_id
        self.department_id = department_id
        self.role = "staff"
        self.db_manager = db_manager  # DatabaseManager instance
    
    # Allows the staff to add a course if it's within their department.
    # Meets Requirement 1: Staff can add courses within their department.
    # Ensures Integrity: Validates course credits are within 1-4 range, prevents duplicate course prefix/number.
    # Instructor Constraint: Ensures instructor belongs to the staff's department.
    def assign_course_to_instructor(self, instructor_id, course_id, semester, year, class_time, class_day, course_credits):
        if not authorize_access({"role": self.role}, "assign", "instructor_courses"):
            print("Access denied.")
            return

        # Check for overlapping class times
        if not check_overlapping_class_times(self.db_manager.conn, instructor_id, semester, year, class_time, class_day):
            print("Error: Instructor has a scheduling conflict at this time.")
            return

        # Check for credit hour limit per semester
        if not check_credit_hour_limit(self.db_manager.conn, instructor_id, semester, year, course_credits):
            print("Error: Assigning this course would exceed the instructor's 12 credit hour limit for the semester.")
            return

        # Proceed with assignment if validations pass
        query = "INSERT INTO assignments (instructor_id, course_id, semester, year) VALUES (?, ?, ?, ?)"
        self.db_manager.execute_query(query, (instructor_id, course_id, semester, year))
        log_action(self.user_id, self.role, "Assigned course to instructor", f"Instructor ID: {instructor_id}, Course ID: {course_id}")
        print(f"Instructor {instructor_id} assigned to course {course_id} for {semester} {year}.")
    
    # Allows the staff to update a course if it belongs to their department.
    # Meets Requirement 1: Staff can modify course details within their department.
    # Integrity Constraint: Ensures changes in course prefix/number propagate to other references.
    # Credit Constraint: Checks that course credit updates remain within the 1-4 range.
    def update_course(self, course_id, **kwargs):
        if not authorize_access({"role": self.role}, "modify", "department_data"):
            print("Access denied.")
            return

        # Verify course belongs to staff's department
        course_department = self.db_manager.get_course_department(course_id)  # Assume function exists
        if course_department != self.department_id:
            print("Error: This course does not belong to your department.")
            return

        # Validate course credits if included in kwargs
        if "credits" in kwargs and not self.db_manager.validate_course_credits(kwargs["credits"]):
            print("Error: Course credits must be between 1 and 4.")
            return

        # Call update_course in database.py to handle the actual update
        success = self.db_manager.update_course(course_id, **kwargs)
        if success:
            log_action(self.user_id, self.role, "Updated course", f"Course ID: {course_id}, Fields: {kwargs}")
            print(f"Course {course_id} updated successfully.")

    # Allows the staff to delete a course if it has no enrollments and belongs to their department.
    # Meets Requirement 1: Staff can delete department courses.
    # Enforces Integrity: Prevents deletion of courses with active enrollments.
    def delete_course(self, course_id):
        if not authorize_access({"role": self.role}, "delete", "department_data"):
            print("Access denied.")
            return

        # Verify course belongs to staff's department and has no enrollments
        course_department = self.db_manager.get_course_department(course_id)  # Assume function exists
        if course_department != self.department_id or self.db_manager.course_has_enrollments(course_id):
            print("Error: Cannot delete this course due to department restriction or active enrollments.")
            return

        # Call delete_course in database.py to handle the actual deletion
        success = self.db_manager.delete_course(course_id)
        if success:
            log_action(self.user_id, self.role, "Deleted course", f"Course ID: {course_id}")
            print(f"Course {course_id} deleted successfully.")

    # Allows the staff to assign a course to an instructor within their department.
    # Instructor Constraint: Ensures assignment is within the same department as the staff and instructor.
    # Integrity Constraints: Checks for overlapping times, duplicate assignments, and 12-credit limit per semester.
    def assign_course_to_instructor(self, course_id, instructor_id, semester, year):
        if not authorize_access({"role": self.role}, "assign", "instructor_courses"):
            print("Access denied.")
            return

        # Check instructor belongs to staff's department
        instructor_department = self.db_manager.get_instructor_department(instructor_id)
        if instructor_department != self.department_id:
            print("Error: Instructor does not belong to your department.")
            return

        # Check for overlapping class times and duplicate assignments
        if self.db_manager.instructor_has_conflicts(instructor_id, course_id, semester, year):
            print("Error: Cannot assign course due to time conflict or duplicate assignment.")
            return

        # Check if instructor's credit hours for the semester exceed 12 with the new course
        if self.db_manager.exceeds_credit_limit(instructor_id, course_id, semester, year, max_credits=12):
            print("Error: Instructor exceeds 12 credit hour limit for this semester.")
            return

        # Assign the course to the instructor
        success = self.db_manager.assign_course(course_id, instructor_id, semester, year)
        if success:
            log_action(self.user_id, self.role, "Assigned course to instructor", f"Course ID: {course_id}, Instructor ID: {instructor_id}")
            print(f"Course {course_id} assigned to instructor {instructor_id} for {semester} {year}.")

    def generate_course_enrollment_report(self, semester):
        courses_by_semester = self.db_manager.get_courses_by_semester(semester)
        report = course_enrollment_report(courses_by_semester)
        print(f"Course Enrollment Report for {semester}:", report)

