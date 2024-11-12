# menus.py

# Common imports
from src.auth.auth import authorize_access
from src.core.logger import log_action, log_data_viewed
from src.core.utils import validate_semester, validate_grade

# Role-specific imports
from src.users.student import Student
from src.users.instructor import Instructor
from src.users.advisor import Advisor
from src.users.staff import Staff
from src.users.admin import Admin

def display_menu(role):
    """Display the menu options based on user role."""
    print("\nOptions:")
    if role == 'student':
        print("1. View Personal Data")
        print("2. View Enrolled Courses")
        print("3. Perform What-If GPA Analysis")
        print("4. Get Course Suggestions for Target GPA")
    elif role == 'instructor':
        print("1. View Teaching Courses")
        print("2. View Students in Course")
    elif role == 'advisor':
        print("1. Add Student to Course")
        print("2. Drop Student from Course")
        print("3. Perform What-If GPA Analysis")
        print("4. Suggest Courses for Student")
        print("5. View GPA Summary")
        print("6. View Department Rankings")
    elif role == 'staff':
        print("1. Assign Course to Instructor")
        print("2. Update Course")
        print("3. Delete Course")
        print("4. Generate Course Enrollment Report")
    elif role == 'admin':
        print("1. View System Logs")
        print("2. Create User")
        print("3. Update User Role")
        print("4. Delete User")
        print("5. View All Records")
        print("6. Generate Reports")
    
    print("98. Logout")
    print("99. Exit")


def handle_student_choice(choice, current_user, db_manager):
    """Handle menu choice for student role."""
    if not authorize_access({"role": current_user.role}, "view", "student_data"):
        print("Access denied.")
        return

    if choice == "1":
        current_user.view_personal_data()
        log_data_viewed(current_user.user_id, "student", "personal_data", current_user.user_id)
    elif choice == "2":
        current_user.view_enrolled_courses()
        log_data_viewed(current_user.user_id, "student", "courses", "all")
    elif choice == "3":
        courses = input("Enter hypothetical courses (format: courseid,grade;...): ")
        course_list = []
        for course_entry in courses.split(';'):
            course_id, grade = course_entry.split(',')
            if validate_grade(grade):
                course_list.append((course_id, grade))
            else:
                print(f"Invalid grade for course {course_id}. Skipping.")
        
        if course_list:
            current_user.what_if_gpa(course_list)
            log_action(current_user.user_id, "student", "what_if_gpa_analysis", f"Courses: {courses}")
    elif choice == "4":
        target_gpa = float(input("Enter target GPA: "))
        available_courses = db_manager.get_available_courses()
        current_user.suggest_courses_for_target_gpa(target_gpa, available_courses)
        log_action(current_user.user_id, "student", "course_suggestions", f"Target GPA: {target_gpa}")

def handle_instructor_choice(choice, current_user, db_manager):
    """Handle menu choice for instructor role."""
    # Authorization check
    if not authorize_access({"role": current_user.role}, "view", "course_data"):
        print("Access denied.")
        return

    if choice == "1":
        current_user.view_courses()
        log_data_viewed(current_user.user_id, "instructor", "courses", "teaching")
    elif choice == "2":
        course_id = input("Enter course ID: ")
        
        # Validate that course_id exists
        if not course_id.strip():
            print("Course ID cannot be empty.")
            return
            
        try:
            course_id = int(course_id)
        except ValueError:
            print("Course ID must be a number.")
            return

        current_user.view_students_in_course(course_id)
        log_data_viewed(current_user.user_id, "instructor", "students", f"course_{course_id}")

def handle_advisor_choice(choice, current_user, db_manager):
    """Handle menu choice for advisor role."""
    # Authorization check
    if not authorize_access({"role": current_user.role}, "manage", "student_courses"):
        print("Access denied.")
        return

    if choice == "1":
        student_id = input("Enter student ID: ")
        course_id = input("Enter course ID: ")
        semester = input("Enter semester (S/F/U): ")
        
        # Semester validation
        if not validate_semester(semester):
            print("Invalid semester. Must be S, F, or U.")
            return
        
        year = input("Enter year: ")
        grade = input("Enter grade: ")
        
        # Grade validation
        if not validate_grade(grade):
            print("Invalid grade. Must be A, B, C, D, F, I, S, or U.")
            return
            
        current_user.add_student_to_course(student_id, course_id, semester, year, grade)
    elif choice == "2":
        student_id = input("Enter student ID: ")
        course_id = input("Enter course ID: ")
        semester = input("Enter semester: ")
        
        if not validate_semester(semester):
            print("Invalid semester. Must be S, F, or U.")
            return
        
        year = input("Enter year: ")
        current_user.drop_student_from_course(student_id, course_id, semester, year)
    elif choice == "3":
        student_id = input("Enter student ID: ")
        courses = input("Enter hypothetical courses (format: courseid,grade;...): ")
        course_list = []
        for course_entry in courses.split(';'):
            course_id, grade = course_entry.split(',')
            if validate_grade(grade):
                course_list.append((course_id, grade))
            else:
                print(f"Invalid grade for course {course_id}. Skipping.")
        if course_list:
            current_user.what_if_gpa_for_student(student_id, course_list)
    elif choice == "4":
        student_id = input("Enter student ID: ")
        target_gpa = float(input("Enter target GPA: "))
        course_options = db_manager.get_available_courses()
        current_user.suggest_courses_for_student_gpa_target(student_id, target_gpa, course_options)
    elif choice == "5":
        current_user.view_gpa_summary()
    elif choice == "6":
        current_user.view_department_rankings()

def handle_staff_choice(choice, current_user):
    """Handle menu choice for staff role."""
    # Authorization check
    if not authorize_access({"role": current_user.role}, "manage", "courses"):
        print("Access denied.")
        return

    if choice == "1":
        course_id = input("Enter course ID: ")
        instructor_id = input("Enter instructor ID: ")
        semester = input("Enter semester (S/F/U): ")

        # Semester validation
        if not validate_semester(semester):
            print("Invalid semester. Must be S, F, or U.")
            return
            
        year = input("Enter year: ")
        class_time = input("Enter class time (HH:MM): ")
        class_day = input("Enter class day (M/T/W/R/F): ")
        credits = int(input("Enter credits (1-4): "))
        
        current_user.assign_course_to_instructor(
            course_id, instructor_id, semester, year, class_time, class_day, credits
        )
    elif choice == "2":
        course_id = input("Enter course ID: ")
        updates = {}
        print("Enter new values (press Enter to skip):")
        for field in ['name', 'credits', 'semester', 'year']:
            value = input(f"{field}: ")
            if value:
                if field == 'semester' and not validate_semester(value):
                    print("Invalid semester. Skipping.")
                    continue
                updates[field] = value
        current_user.update_course(course_id, **updates)
    elif choice == "3":
        course_id = input("Enter course ID: ")
        current_user.delete_course(course_id)
    elif choice == "4":
        semester = input("Enter semester (S/F/U): ")
        if not validate_semester(semester):
            print("Invalid semester. Must be S, F, or U.")
            return
        current_user.generate_course_enrollment_report(semester)

def handle_admin_choice(choice, current_user):
    """Handle menu choice for admin role."""
    # Authorization check
    if not authorize_access({"role": current_user.role}, "manage", "system"):
        print("Access denied.")
        return

    if choice == "1":
        current_user.view_logs()
    elif choice == "2":
        username = input("Enter username: ")
        password = input("Enter password: ")
        role = input("Enter role: ")
        current_user.create_user(username, password, role)
    elif choice == "3":
        user_id = input("Enter user ID: ")
        new_role = input("Enter new role: ")
        current_user.update_user(user_id, new_role)
    elif choice == "4":
        user_id = input("Enter user ID: ")
        current_user.delete_user(user_id)
    elif choice == "5":
        table_name = input("Enter table name to view: ")
        current_user.view_all_records(table_name)
    elif choice == "6":
        report_type = input("Enter report type (GPA_summary/department_ranking/course_enrollment_summary): ")
        current_user.generate_report(report_type)