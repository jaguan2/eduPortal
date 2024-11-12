# auth.py
# authenticate_user, authorize_access
# auth.py to check user roles and enforce data visibility. Each user module enforces restrictions based on user type.
# Role-based permissions to ensure users only access allowed data

import sqlite3
import os
from config.config import DATABASE_PATH  # Import DATABASE_PATH to get the correct database path

ROLE_TO_TABLE_MAP = {
    'student': 'students',
    'advisor': 'advisors',
    'instructor': 'instructors',
    'staff': 'staff',
    'admin': 'admin'
}

def get_database_connection():
    # Use DATABASE_PATH from config/config.py
    conn = sqlite3.connect(DATABASE_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def select_user_role():
    """Prompt the user to select a role and return the corresponding table name."""
    print("Select your role:")
    for i, role in enumerate(ROLE_TO_TABLE_MAP.keys(), start=1):
        print(f"{i}. {role.capitalize()}")
    
    role_choice = input("Enter the number corresponding to your role: ").strip()
    try:
        role_index = int(role_choice) - 1
        if 0 <= role_index < len(ROLE_TO_TABLE_MAP):
            role = list(ROLE_TO_TABLE_MAP.keys())[role_index]
            return role
        else:
            print("Invalid choice. Please select a valid number.")
            return None
    except ValueError:
        print("Invalid input. Please enter a number.")
        return None
    
## Authenticates a user based on username, password, and role.
## Sets up initial access based on the role (student, advisor, instructor, staff, admin).
## Meets Requirement: Role-based login validation and permission setup for access control.

def authenticate_user(db_manager):
    """Authenticate a user by username, password, and selected role."""
    while True:
        role = select_user_role()
        if role is None:
            continue

        username = input("Enter username: ").strip()
        password = input("Enter password: ").strip()
        table_name = ROLE_TO_TABLE_MAP[role]

        # Use the db_manager's connection to query
        cursor = db_manager.conn.cursor()
        query = f"SELECT * FROM {table_name} WHERE username = ? AND password = ?"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()
        cursor.close()

        if user:
            user_data = {
                'id': user[0],  # Assuming the first column is the user ID
                'username': username,
                'role': role
            }
            print(f"Login successful! Welcome, {username}.")
            return user_data
        else:
            print("Invalid username or password. Please try again.")

## Enforces role-based permissions to restrict or allow access to resources.
## Checks if a user has the correct permissions based on role.
## Meets Requirement: Enforces access restrictions based on user role (Requirement 3).
def authorize_access(user, action, resource):
    # Define permissions for each role
    role_permissions = {
        # Student: Can view their own data but cannot modify it
        'student': {
            'view': ['student_data', 'course_data'],
            'calculate': ['gpa']  # Added for GPA calculations
        },
        # Advisor: Can manage student courses in their department
        'advisor': {
            'view': ['student_data', 'course_data'],
            'add': ['course_enrollments'],
            'drop': ['course_enrollments'],
            'manage': ['student_courses']  # Added for test compliance
        },  
        # Instructor: Can view and modify course-related data
        'instructor': {
            'view': ['courses_teaching', 'students_enrolled', 'course_data'],
            'modify': ['grades']
        },
        # Staff: Can manage department data and courses
        'staff': {
            'add': ['department_data', 'courses'],
            'modify': ['department_data'],
            'view': ['department_data'],
            'manage': ['courses']  # Added for test compliance
        },
        # Admin: Full system access
        'admin': {
            'view': ['all_records', 'system_logs'],
            'modify': ['all_records'],
            'manage': ['user_accounts', 'system'],  # Added system management
            'generate': ['reports']
        }
    }
    
    # Extract role and permissions
    role = user['role']
    permissions = role_permissions.get(role, {})

    # Check if action is allowed for the resource
    allowed_resources = permissions.get(action, [])
    if resource in allowed_resources:
        print(f"Access granted for {action} on {resource} to user {user['username']} ({role}).")
        return True
    
    print(f"Access denied for {action} on {resource} to user {user['username']} ({role}).")
    return False
