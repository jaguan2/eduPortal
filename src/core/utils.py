# Utility functions (like validation and formatting)
# Requirement 4: No duplicate entities (students, instructors, staff, advisors, courses, departments).
# Insertion functions across files (e.g., add_student, add_instructor) will include checks for existing entries.
# Functions to insert data will include validation in database.py or utils.py to check if a record already exists, using unique constraints (like unique usernames or course IDs).

# utils.py for helper functions, e.g., GPA formula enforcement, unique course IDs, valid student IDs. These constraints ensure database consistency on every operation (insert/update/delete).

# Standard GPA Formula
# calculate_gpa,  Implement the GPA calculation method based on a 4.0 scale, assigning point values to each grade.

# Valid Grades for Students
# validate_grade,  Implement a helper function to enforce valid grades (A, B, C, D, F, I, S, U) for each student record.

# Invalid Grades (e.g., B+):
# validate_grade
# Ensure only valid grades (A, B, C, D, F, I, S, U) are assigned.

# Course Credits Between 1 and 4 (and staff.py)
# validate_course_credits
# Ensure credit hours are within the 1–4 range when adding or updating course records.

# DATA INTEGRITY CONSTGRAINTS
# GPA Between 0 and 4
# validate_gpa
# Ensure calculated GPAs are always between 0 and 4.

# Student ID Must Start with 'U':
# validate_student_id
# Add validation to ensure all student IDs begin with ‘U’.

import re
from src.core.logger import logger

# Ensures that only valid grades are used, allowing A, B, C, D, F, I, S, U.
# Meets Requirement 6: Validates grade inputs to ensure data integrity.
def validate_grade(grade):
    valid_grades = {'A', 'B', 'C', 'D', 'F', 'I', 'S', 'U'}
    if grade in valid_grades:
        logger.info(f"Validated grade '{grade}' as acceptable.")
        return True
    logger.error(f"Invalid grade '{grade}' provided. Use one of {valid_grades}.")
    print(f"Error: '{grade}' is not a valid grade. Use one of {valid_grades}.")
    return False

# Ensures that student IDs start with 'U', enforcing proper ID format.
# Meets Requirement 3: Validates student ID format to meet system constraints.
def validate_student_id(student_id):
    if isinstance(student_id, str) and student_id.startswith('U'):
        logger.info(f"Validated student ID '{student_id}' format as correct.")
        return True
    logger.error(f"Invalid student ID format for '{student_id}'. Must start with 'U'.")
    print("Error: Student ID must start with 'U'.")
    return False

# Ensures course credits are between 1 and 4, enforcing a valid credit range.
# Meets Requirement 6: Validates course credit range for accurate course data.
def validate_course_credits(credits):
    if isinstance(credits, int) and 1 <= credits <= 4:
        logger.info(f"Validated course credits '{credits}' as within the accepted range (1-4).")
        return True
    logger.error(f"Invalid course credits '{credits}'. Must be an integer between 1 and 4.")
    print("Error: Course credits must be an integer between 1 and 4.")
    return False

# Checks if the username is unique within the specified table to prevent duplicates.
# Meets Requirement 4: Ensures unique usernames across entities.
def validate_username_uniqueness(db_manager, username, table="students"):
    query = f"SELECT 1 FROM {table} WHERE username = ? LIMIT 1"
    result = db_manager.fetch_one(query, (username,))
    if result:
        logger.error(f"Username '{username}' already exists in the '{table}' table.")
        print(f"Error: Username '{username}' already exists in {table}.")
        return False
    logger.info(f"Username '{username}' is unique within the '{table}' table.")
    return True

# Confirms the semester is one of the allowed values: spring, fall, or summer.
# Integrity Constraint: Restricts enrollment to specified valid semesters.
def validate_semester(semester):
    valid_semesters = {"spring", "fall", "summer"}
    if semester.lower() in valid_semesters:
        logger.info(f"Semester '{semester}' is valid.")
        return True
    else:
        logger.warning(f"Invalid semester '{semester}'. Allowed values are {valid_semesters}.")
        return False

# Checks if an instructor has a class time conflict within the same semester and year.
# Requirement: Ensures instructors don’t have overlapping class times on the same day in a semester.
# Integrity Constraint: Prevents scheduling conflicts for instructors.
def check_overlapping_class_times(db_conn, instructor_id, semester, year, new_class_time, new_class_day):
    query = (
        "SELECT classTime, classDay FROM courses "
        "JOIN assignments ON courses.id = assignments.course_id "
        "WHERE assignments.instructor_id = ? AND courses.semester = ? AND courses.year = ?"
    )
    cursor = db_conn.cursor()
    cursor.execute(query, (instructor_id, semester, year))
    existing_classes = cursor.fetchall()

    # Check for overlapping times on the same day
    for class_time, class_day in existing_classes:
        if class_day == new_class_day and class_time == new_class_time:
            logger.warning(
                f"Conflict detected: Instructor '{instructor_id}' already has a class scheduled at '{new_class_time}' on '{new_class_day}' for semester '{semester}' {year}."
            )
            return False  # Conflict found

    logger.info(
        f"No conflict for instructor '{instructor_id}' with new class at '{new_class_time}' on '{new_class_day}' for semester '{semester}' {year}."
    )
    return True  # No conflicts

# Ensures that adding a new course does not exceed the 12 credit hour limit per semester for an instructor.
# Requirement: Limits instructors to teaching no more than 12 credit hours per semester.
# Integrity Constraint: Enforces workload restrictions for fair scheduling.
def check_credit_hour_limit(db_conn, instructor_id, semester, year, new_course_credits):
    query = (
        "SELECT SUM(credits) FROM courses "
        "JOIN assignments ON courses.id = assignments.course_id "
        "WHERE assignments.instructor_id = ? AND courses.semester = ? AND courses.year = ?"
    )
    cursor = db_conn.cursor()
    cursor.execute(query, (instructor_id, semester, year))
    current_credits = cursor.fetchone()[0] or 0

    # Log the current and potential new credit hours
    logger.info(
        f"Instructor '{instructor_id}' has {current_credits} credit hours for semester '{semester}' {year}."
        f" Attempting to add {new_course_credits} new credit hours."
    )

    # Determine if adding the course would exceed the limit
    if (current_credits + new_course_credits) > 12:
        logger.warning(
            f"Cannot add course for instructor '{instructor_id}' as it would exceed the 12 credit hour limit."
        )
        return False

    logger.info(
        f"Adding course is within the credit hour limit for instructor '{instructor_id}' for semester '{semester}' {year}."
    )
    return True  # True if within the 12-hour limit


# Ensures course codes follow the "XXX1234" format (3 letters + 4 numbers).
# Integrity Constraint: Validates consistent and unique course identification.
def validate_course_code(prefix, number):
    prefix_valid = re.match(r'^[A-Z]{3}$', prefix)  # Checks if prefix is exactly 3 uppercase letters
    number_valid = re.match(r'^\d{4}$', str(number))  # Checks if number is exactly 4 digits
    if prefix_valid and number_valid:
        logger.info(f"Course code '{prefix}{number}' is valid.")
        return True

    logger.error(
        f"Invalid course code format for '{prefix}{number}'. Course code must have a 3-letter prefix "
        f"followed by a 4-digit number (e.g., 'CSE1010')."
    )
    return False

# Checks if a course prefix and number combination is unique within the courses table.
# Meets Requirement 4: Ensures unique course identifiers for consistent data.
def validate_course_prefix_number_uniqueness(db_manager, prefix, number):
    query = "SELECT 1 FROM courses WHERE prefix = ? AND number = ? LIMIT 1"
    result = db_manager.fetch_one(query, (prefix, number))
    if result:
        # Log an error if the course prefix and number already exist in the courses table
        logger.error(f"Course with prefix '{prefix}' and number '{number}' already exists.")
        print(f"Error: Course with prefix '{prefix}' and number '{number}' already exists.")
        return False
    # Log info if the course prefix and number combination is unique
    logger.info(f"Course with prefix '{prefix}' and number '{number}' is unique.")
    return True

# Checks if a student is already enrolled in a specific course for the given semester and year.
def validate_single_enrollment(db_conn, student_id, course_id, semester, year):
    query = """
    SELECT 1 
    FROM taken 
    WHERE student = ? AND course = ? AND semester = ? AND year = ? 
    LIMIT 1;
    """
    cursor = db_conn.cursor()
    cursor.execute(query, (student_id, course_id, semester, year))
    result = cursor.fetchone()

    if result is None:
        logger.info(f"Student {student_id} is not enrolled in course {course_id} for {semester} {year}. Enrollment allowed.")
        return True  # Student is not enrolled, allowing enrollment
    else:
        logger.warning(f"Student {student_id} is already enrolled in course {course_id} for {semester} {year}. Enrollment prevented.")
        return False  # Student is already enrolled, preventing duplicate enrollment