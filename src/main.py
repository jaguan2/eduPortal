# main.py
# Main entry point for CLI commands
import sqlite3
import sys
import os
# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import authentication modules
from src.auth.auth import authenticate_user, authorize_access

# Import database setup and management
from data.db_setup import *
from src.core.database import DatabaseManager

# Import utility modules
from src.core.utils import validate_semester, validate_grade
from src.core.logger import log_action, log_data_viewed

# Import user role modules
from src.users.student import Student
from src.users.instructor import Instructor
from src.users.advisor import Advisor
from src.users.staff import Staff
from src.users.admin import Admin

# Configuration
from config.config import DATABASE_PATH, LOG_PATH  # Assuming you have these in config.py
from menus import display_menu, handle_student_choice, handle_instructor_choice, handle_advisor_choice, handle_staff_choice, handle_admin_choice


class EduPortal:
    def __init__(self, db_manager):
        self.db_manager = db_manager
        self.current_user = None

    def initialize_user_interface(self, user_data):
        role = user_data.get('role')
        user_id = user_data.get('id')
        department_id = user_data.get('department_id')

        if role == 'student':
            return Student(user_id, self.db_manager)
        elif role == 'instructor':
            return Instructor(user_id, self.db_manager)
        elif role == 'advisor':
            return Advisor(user_id, department_id, self.db_manager)
        elif role == 'staff':
            return Staff(user_id, department_id, self.db_manager)
        elif role == 'admin':
            return Admin(user_id, self.db_manager)
        else:
            raise ValueError(f"Unknown role: {role}")

    def run(self):
        print("Welcome to the EduPortal CLI system.")
        
        # Login loop with error handling
        while not self.current_user:
            try:
                user_data = authenticate_user(self.db_manager)  # Authenticate using the shared db_manager
                
                if user_data:
                    self.current_user = self.initialize_user_interface(user_data)
                    log_action(self.current_user.user_id, self.current_user.role, "login", "User logged in successfully")
                    
            except ValueError as e:
                print(f"Error initializing user interface: {e}")
                log_action("N/A", "N/A", "error", f"User initialization error: {str(e)}")
            
            except Exception as e:
                print(f"Unexpected error during login: {e}")
                log_action("N/A", "N/A", "error", f"Unexpected login error: {str(e)}")

        # Main menu loop
        while True:
            try:
                display_menu(self.current_user.role)
                choice = input("Enter your choice: ")
                
                # Logout or exit choices
                if choice == "98":
                    log_action(self.current_user.user_id, self.current_user.role, "logout", "User logged out")
                    print("Logging out...")
                    self.current_user = None
                    self.run()  # Restart login loop
                    break
                elif choice == "99":
                    log_action(self.current_user.user_id, self.current_user.role, "exit", "User exited system")
                    print("Exiting...")
                    break
                
                # Handle role-specific choices
                if self.current_user.role == 'student':
                    handle_student_choice(choice, self.current_user, self.db_manager)
                elif self.current_user.role == 'instructor':
                    handle_instructor_choice(choice, self.current_user, self.db_manager)
                elif self.current_user.role == 'advisor':
                    handle_advisor_choice(choice, self.current_user, self.db_manager)
                elif self.current_user.role == 'staff':
                    handle_staff_choice(choice, self.current_user, self.db_manager)
                elif self.current_user.role == 'admin':
                    handle_admin_choice(choice, self.current_user, self.db_manager)
            
            except Exception as e:
                print(f"Error processing request: {e}")
                log_action(self.current_user.user_id, self.current_user.role, "error", f"Error: {str(e)}")

        # Close connections on exit
        if self.current_user:
            self.current_user.close_connection()
        self.db_manager.close_connection()

if __name__ == '__main__':
    # Initialize the DatabaseManager
    db_manager = DatabaseManager(DATABASE_PATH)
    
    # Pass the db_manager instance to EduPortal
    portal = EduPortal(db_manager)
    
    # Run the portal
    portal.run()
