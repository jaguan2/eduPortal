To implement this project effectively, here’s an **ordered approach** that builds the foundation first and progressively addresses each layer of functionality. By following this order, you can ensure that each component has the necessary support from the underlying layers, making it easier to integrate additional requirements as you progress.

### Suggested Implementation Order

1. **Database Setup and Core Schema**
   - **Goal**: Set up a stable database schema with all tables and core constraints.
   - **Files**:
     - `data/db_setup.py` (formerly `tableInitialization.py`) to create tables with SQL commands.
     - `src/core/database.py` for database connection management.
   - **Tasks**:
     - Define tables (`students`, `courses`, `instructors`, `departments`, `advisors`, `staff`).
     - Set up foreign keys and relationships (e.g., department relationships for courses and instructors).
     - Add basic constraints, such as referential integrity and unique course prefix/number combinations.

2. **Database Utility Functions**
   - **Goal**: Implement core database interaction utilities for CRUD operations.
   - **Files**: `src/core/utils.py` and `src/core/database.py`.
   - **Tasks**:
     - Develop basic utility functions for common validations, such as:
       - `validate_grade`: Ensure only valid grades are used.
       - `validate_student_id`: Ensure student IDs start with “U.”
       - `validate_course_credits`: Ensure course credits are between 1 and 4.
     - Create helper functions to support CRUD operations (e.g., check if a student exists, validate course IDs).

3. **Authentication and Role-Based Access**
   - **Goal**: Implement authentication and enforce access restrictions.
   - **Files**: `src/auth/auth.py`
   - **Tasks**:
     - Set up role-based authentication functions (e.g., `login`, `authorize_access`).
     - Define role permissions for each user type (student, advisor, instructor, staff, admin).

4. **Core Logging Mechanism**
   - **Goal**: Implement a logging system to track operations, providing accountability for data access and modifications.
   - **Files**: `src/core/logger.py`
   - **Tasks**:
     - Develop `log_action` and `log_data_viewed` functions to track data interactions.
     - Use these functions to log CRUD operations, including user ID, role, timestamp, and specific action.

5. **Basic User Actions (CRUD Operations)**
   - **Goal**: Implement basic CRUD functions for each role, focusing on core actions for `student.py`, `instructor.py`, `advisor.py`, `staff.py`, and `admin.py`.
   - **Files**: Each user file in `src/users/`
   - **Tasks**:
     - For `student.py`: View personal data, enroll in courses, etc.
     - For `advisor.py`: Register and withdraw students from courses.
     - For `staff.py`: Add, update, and delete records for students, instructors, etc.
     - For `instructor.py`: View assigned courses and students in courses.
     - For `admin.py`: Access and view logs.

6. **Validation Constraints for Business Rules**
   - **Goal**: Implement specific validation constraints for key business rules, such as unique enrollment per semester.
   - **Files**: `src/users/student.py`, `src/users/instructor.py`, and `src/core/utils.py`
   - **Tasks**:
     - In `student.py`: Enforce single-semester enrollment, grade validation, and semester restrictions (spring, fall, summer).
     - In `instructor.py`: Prevent overlapping class times and limit credit hours to 12 per semester.
     - Add checks in `utils.py` for common validations to enforce these constraints across modules.

7. **Advanced GPA and Enrollment Constraints**
   - **Goal**: Implement GPA calculations and enrollment constraints.
   - **Files**: `src/analytics/gpa_analysis.py`, `src/users/student.py`, and `src/users/advisor.py`
   - **Tasks**:
     - Develop functions to calculate GPA and ensure GPA is between 0 and 4.
     - Implement constraints for enrollment prerequisites and ensure data consistency for GPA calculations.

8. **What-If Analysis and Reports**
   - **Goal**: Implement GPA “What-If” analysis and required summary reports.
   - **Files**: `src/analytics/gpa_analysis.py`
   - **Tasks**:
     - Implement `what_if_gpa_projection` for GPA changes based on hypothetical grades.
     - Develop summary reports for GPA rankings by department, average GPAs by major, etc.

9. **Error Handling and Final Validation**
   - **Goal**: Ensure robust error handling, testing each function for data consistency.
   - **Files**: All modules
   - **Tasks**:
     - Add error handling for user inputs and invalid data entries.
     - Test each module thoroughly, especially user roles and data integrity constraints.

---

### Summary of Implementation Phases

This step-by-step approach ensures that you build a solid foundation first, focusing on core database and role-based functionalities before moving to advanced analytics and reporting. It also allows you to integrate logging and validations gradually, maintaining data integrity and enforcing business rules as each new layer of functionality is added.

---

Here's a structured approach to testing your system, focusing on functionality, data integrity, and error handling across different modules and user roles. Testing should proceed in phases: initialization, validation of individual functions, and role-based testing.

### 1. **Database Initialization Testing**
   - **Goal**: Ensure all tables are created with the expected schema, constraints, and relationships.
   - **Steps**:
     1. Run the database initialization script to create tables.
     2. Verify that all tables exist and check each table’s schema for correct columns, data types, primary keys, and foreign key constraints.
     3. Test `ON DELETE CASCADE` and other foreign key constraints by inserting and attempting to delete data across related tables (e.g., deleting a student with an enrollment should cascade).

### 2. **Individual Module Testing**
   - **Goal**: Validate the core functionalities of each module independently, including data validation and error handling.
   - **Suggested Order**:
     1. **Utils Module**: Test helper functions that handle validations (e.g., `validate_grade`, `validate_student_id`, `validate_course_credits`). For each function:
        - **Input Variations**: Provide both valid and invalid inputs.
        - **Expected Behavior**: Confirm that valid inputs are accepted and invalid inputs return the correct error or `False`.
     2. **DatabaseManager**: Test CRUD operations and validation checks.
        - **Add Functions**: Test add operations for students, courses, etc., checking that duplicates or invalid data are handled properly.
        - **Update Functions**: Check that updates respect constraints (e.g., modifying a course prefix/number doesn’t create duplicates).
        - **Delete Functions**: Validate `ON DELETE CASCADE` behavior and other constraints that prevent deletion of referenced records.
     3. **Logger Module**: Check if log entries are created for each action.
        - Verify that log entries contain relevant information (user ID, role, action).
     4. **GPA Analysis Module**: Test GPA calculations and projections.
        - Validate GPA results against expected values for different scenarios, especially for edge cases like no courses or all failing grades.
        - Test What-If analysis with various grade and credit combinations.
     5. **Role-Specific Modules**:
        - **Student**: Test `view_personal_data`, What-If GPA analysis, and any other functionality allowed for students.
        - **Advisor**: Validate enrollment constraints, such as department checks and single-semester enrollment for students.
        - **Instructor**: If instructors have additional functionality, validate each action and ensure proper error handling.
        - **Staff**: Test staff constraints, especially for managing courses and instructors within the same department.
        - **Admin**: Verify the ability to create, update, and delete users, and check that admin-only actions (e.g., log viewing) are restricted.

### 3. **Role-Based Testing**
   - **Goal**: Ensure role-based access control and data visibility restrictions are correctly enforced.
   - **Steps**:
     - **Student Role**:
       - Test that students can only view their own data.
       - Verify What-If analysis functionality with GPA projections.
     - **Advisor Role**:
       - Validate that advisors can add/drop students in courses within their department.
       - Check that GPA analysis for students only works for students in the same department.
     - **Instructor Role**:
       - Ensure that any assigned role-specific actions respect instructor-specific constraints, such as non-overlapping class times.
     - **Staff Role**:
       - Confirm that staff can add, update, and delete data only within their department.
       - Validate restrictions on assigning instructors within the same department and checking for conflicting class times.
     - **Admin Role**:
       - Verify access to all records and logging functionality.
       - Confirm admin actions such as creating users and viewing logs work correctly.

### 4. **Error Handling Testing**
   - **Goal**: Ensure the system gracefully handles invalid inputs, missing data, and other common errors.
   - **Steps**:
     - Test invalid inputs for each function across modules.
     - Check for proper error messages and prevent program crashes.
     - Verify foreign key constraints by trying to reference non-existent IDs.
     - Test for validation constraints (e.g., `validate_student_id` and `validate_course_credits`) to confirm the system rejects invalid data.

### 5. **Data Integrity and Consistency Testing**
   - **Goal**: Ensure data remains consistent across operations.
   - **Steps**:
     - Test scenarios involving cascading deletions to verify data consistency.
     - Check that GPA calculations stay within a 0–4 range.
     - Validate referential integrity by adding, modifying, or deleting records in related tables.
     - Test edge cases, such as maximum credit limits for instructors, or adding students to already-full courses.

### 6. **Final Validation and Review**
   - **Goal**: Ensure system functionality aligns with project requirements.
   - **Steps**:
     - Review logs to verify every action is logged with relevant metadata.
     - Run end-to-end scenarios for each role to validate project requirements (e.g., enrollment constraints, GPA calculations, report generation).
     - Document each test and outcome for final review, ensuring all requirements have been thoroughly tested.

By following this structured approach, you’ll systematically cover all functionality, constraints, and roles, ensuring your system is robust, secure, and meets project specifications.