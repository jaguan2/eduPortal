# For experimentation to have a general idea about all the use cases
## Use Cases
---

1. **UC01-InitializeDatabase**
   - **Description**: Initialize database tables required for system functionality.
   - **Actors**: System
   - **Flow**:
     1. System connects to the database.
     2. Creates necessary tables (`students`, `courses`, `advisors`, `instructors`, `staff`, `admin`, `taken`, `major`, `department`) if they do not already exist.
     3. Displays a success message upon completion.

2. **UC02-DisplayMenuBasedOnRole**
   - **Description**: Display different menu options to users based on their role.
   - **Actors**: All users (Students, Advisors, Instructors, Staff, Admin)
   - **Flow**:
     1. User logs in with a specific role.
     2. System displays available menu options tailored to the role (e.g., course suggestions for students, log viewing for admin).

3. **UC03-HandleStudentViewPersonalData**
   - **Description**: Allow students to view their own personal data.
   - **Actors**: Student
   - **Flow**:
     1. Student selects "View Personal Data".
     2. System retrieves and displays the student’s information.
     3. Logs the data access action.

4. **UC04-HandleStudentViewEnrolledCourses**
   - **Description**: Display the courses in which a student is currently enrolled.
   - **Actors**: Student
   - **Flow**:
     1. Student selects "View Enrolled Courses".
     2. System retrieves and displays a list of the student’s enrolled courses.
     3. Logs the data access action.

5. **UC05-HandleStudentWhatIfGPAAnalysis**
   - **Description**: Perform a GPA projection analysis based on hypothetical courses and grades.
   - **Actors**: Student
   - **Flow**:
     1. Student selects "What-If GPA Analysis" and inputs hypothetical courses with grades.
     2. System calculates the projected GPA and displays the result.
     3. Logs the analysis action.

6. **UC06-HandleAdvisorAddStudentToCourse**
   - **Description**: Allow advisors to add a student to a course if the student’s major is in the advisor’s department.
   - **Actors**: Advisor
   - **Flow**:
     1. Advisor selects "Add Student to Course" and provides the student ID, course ID, semester, and grade.
     2. System verifies that the student’s major matches the advisor’s department.
     3. If valid, system adds the student to the course and logs the action.

7. **UC07-HandleAdvisorDropStudentFromCourse**
   - **Description**: Allow advisors to drop a student from a course if the student’s major is in the advisor’s department.
   - **Actors**: Advisor
   - **Flow**:
     1. Advisor selects "Drop Student from Course" and provides the student ID and course ID.
     2. System verifies that the student’s major matches the advisor’s department.
     3. If valid, system removes the student from the course and logs the action.

8. **UC08-HandleInstructorViewCourses**
   - **Description**: Allow instructors to view details of the courses they are assigned to teach.
   - **Actors**: Instructor
   - **Flow**:
     1. Instructor selects "View Teaching Courses".
     2. System retrieves a list of courses the instructor is assigned to.
     3. Logs the data access action.

9. **UC09-HandleInstructorViewStudentsInCourse**
   - **Description**: Allow instructors to view a list of students enrolled in a specific course they teach.
   - **Actors**: Instructor
   - **Flow**:
     1. Instructor selects "View Students in Course" and provides the course ID.
     2. System verifies that the instructor is assigned to the course.
     3. If verified, system displays the list of enrolled students and logs the access.

10. **UC10-HandleStaffAssignCourseToInstructor**
    - **Description**: Allows staff to assign a course to an instructor within the same department.
    - **Actors**: Staff
    - **Flow**:
      1. Staff selects "Assign Course to Instructor" and provides course, instructor, semester, year, time, and day.
      2. System checks for overlapping schedules and verifies credit hour limits.
      3. If valid, course is assigned, and the action is logged.

11. **UC11-HandleStaffUpdateCourse**
    - **Description**: Allows staff to update details of a course within their department.
    - **Actors**: Staff
    - **Flow**:
      1. Staff selects "Update Course" and provides the course ID and updated details.
      2. System validates the new data (e.g., semester format, credit range).
      3. If valid, course details are updated, and the action is logged.

12. **UC12-HandleStaffDeleteCourse**
    - **Description**: Allows staff to delete a course if it has no active enrollments.
    - **Actors**: Staff
    - **Flow**:
      1. Staff selects "Delete Course" and provides the course ID.
      2. System checks if the course has active enrollments.
      3. If not enrolled, course is deleted, and the action is logged.

13. **UC13-HandleAdminViewLogs**
    - **Description**: Allows admins to view the system’s log file for monitoring user activities.
    - **Actors**: Admin
    - **Flow**:
      1. Admin selects "View System Logs".
      2. System retrieves and displays recent log entries.
      3. Admin reviews log for audit purposes.

14. **UC14-HandleAdminCreateUser**
    - **Description**: Allows admins to create a new user account with a specific role.
    - **Actors**: Admin
    - **Flow**:
      1. Admin selects "Create User" and enters username, password, and role.
      2. System checks for unique username and assigns the role.
      3. User account is created, and the action is logged.

15. **UC15-HandleAdminUpdateUserRole**
    - **Description**: Allows admins to update the role of an existing user.
    - **Actors**: Admin
    - **Flow**:
      1. Admin selects "Update User Role" and provides user ID and new role.
      2. System updates the role of the user.
      3. Logs the role change for auditing purposes.

16. **UC16-HandleAdminDeleteUser**
    - **Description**: Allows admins to delete a user account if it’s not critical to system integrity.
    - **Actors**: Admin
    - **Flow**:
      1. Admin selects "Delete User" and provides the user ID.
      2. System deletes the user account if there are no dependency issues.
      3. Logs the action.

17. **UC17-HandleDatabaseQueryExecution**
    - **Description**: Execute specific database queries to retrieve, update, or delete data based on user commands.
    - **Actors**: System
    - **Flow**:
      1. User initiates a command that requires database access (e.g., view, add, update).
      2. System executes the database query using parameters provided by the user.
      3. Action results are displayed, and the operation is logged.

18. **UC18-HandleGPAProjectionCalculation**
    - **Description**: Calculate and return a GPA projection based on a list of hypothetical courses.
    - **Actors**: System
    - **Flow**:
      1. User initiates a "What-If GPA" calculation.
      2. System computes the GPA based on provided courses and grades.
      3. Projected GPA is displayed, and the analysis is logged.

19. **UC19-GenerateCourseEnrollmentReport**
    - **Description**: Generate an enrollment report for each course, showing total enrollments and average grades.
    - **Actors**: System, Admin, Staff
    - **Flow**:
      1. Admin or staff selects "Generate Course Enrollment Report".
      2. System retrieves course data by semester.
      3. Report is generated and displayed.

20. **UC20-GenerateGPAReportByDepartment**
    - **Description**: Generate a GPA summary report, showing highest, lowest, and average GPA for each department.
    - **Actors**: Admin, Staff
    - **Flow**:
      1. Admin or staff selects "Generate Department GPA Report".
      2. System retrieves GPA data by department.
      3. Report is generated and displayed, showing GPA statistics.

21. **UC21-ValidateAndLogUserAuthentication**
    - **Description**: Authenticate user login and log each successful and unsuccessful attempt.
    - **Actors**: All users, System
    - **Flow**:
      1. User provides login credentials.
      2. System validates credentials and assigns the correct role.
      3. Logs successful logins; logs errors for failed attempts.

22. **UC22-HandleAdvisorWhatIfGPAForStudent**
   - **Description**: Allows advisors to perform a "What-If GPA" analysis for a student in their department.
   - **Actors**: Advisor
   - **Flow**:
     1. Advisor selects "What-If GPA for Student" and inputs student ID and hypothetical courses with grades.
     2. System verifies the student belongs to the advisor's department.
     3. If valid, the system performs the GPA analysis and displays the projected GPA.
     4. Logs the analysis action.

23. **UC23-HandleAdvisorSuggestCoursesForStudent**
   - **Description**: Advisors suggest courses to students aiming to reach a target GPA.
   - **Actors**: Advisor
   - **Flow**:
     1. Advisor selects "Suggest Courses for Student" and enters student ID and target GPA.
     2. System verifies student’s department matches the advisor’s.
     3. If valid, the system recommends courses based on the target GPA.
     4. Logs the course suggestion action.

24. **UC24-HandleStaffGenerateCourseEnrollmentReport**
   - **Description**: Allows staff to generate a course enrollment report for a specific semester.
   - **Actors**: Staff
   - **Flow**:
     1. Staff selects "Generate Course Enrollment Report" and specifies the semester.
     2. System retrieves all courses and enrollment data for the specified semester.
     3. Report is generated, showing total enrollments and average grade per course.
     4. Logs the report generation action.

25. **UC25-HandleAdminGenerateReport**
   - **Description**: Allows admin to generate summary reports, including GPA summary, department ranking, and enrollment summary.
   - **Actors**: Admin
   - **Flow**:
     1. Admin selects "Generate Reports" and chooses the type of report (GPA summary, department ranking, or enrollment summary).
     2. System retrieves relevant data and generates the requested report.
     3. Displays the report to the admin.
     4. Logs the report generation action.

26. **UC26-HandleAdminViewAllRecords**
   - **Description**: Allows admin to view all records from specified tables (e.g., students, courses, instructors).
   - **Actors**: Admin
   - **Flow**:
     1. Admin selects "View All Records" and specifies the table.
     2. System retrieves all records from the specified table.
     3. Displays the data to the admin and logs the action.

27. **UC27-HandleAdminCreateLogEntry**
   - **Description**: Log all CRUD actions and user views for auditing purposes.
   - **Actors**: System, Admin
   - **Flow**:
     1. System captures user action details (e.g., data access, modification).
     2. Logs the action with timestamp, user ID, role, and type of operation.
     3. Admin can review these logs for auditing.

28. **UC28-ValidateCoursePrefixNumberUniqueness**
   - **Description**: Ensure each course prefix and number combination is unique before adding a new course.
   - **Actors**: System
   - **Flow**:
     1. User attempts to add a new course.
     2. System checks that the prefix and number do not duplicate existing entries.
     3. If unique, course is added; if not, an error is displayed.

29. **UC29-ValidateGradeInputs**
   - **Description**: Validate grade inputs before assigning them to any student record to ensure consistency.
   - **Actors**: System
   - **Flow**:
     1. User attempts to assign a grade.
     2. System verifies the grade against accepted values (A, B, C, D, F, I, S, U).
     3. If valid, grade is accepted; otherwise, the system displays an error.

30. **UC30-ValidateCourseCreditRange**
   - **Description**: Ensure that course credits are within the allowed range of 1 to 4.
   - **Actors**: System
   - **Flow**:
     1. User attempts to add or update a course.
     2. System checks that the course credits are within the specified range.
     3. If valid, the course is added/updated; otherwise, an error is displayed.

31. **UC31-HandleDatabaseConnection**
   - **Description**: Establish and maintain a secure connection to the SQLite database for data operations.
   - **Actors**: System
   - **Flow**:
     1. System initializes a connection to the database upon program start.
     2. Connection is verified with foreign key support enabled.
     3. System closes connection upon program termination.

32. **UC32-EnsureSingleEnrollment**
   - **Description**: Prevent students from enrolling in the same course more than once per semester.
   - **Actors**: System, Advisor
   - **Flow**:
     1. Advisor attempts to enroll a student in a course.
     2. System checks that the student isn’t already enrolled in that course for the selected semester.
     3. If not enrolled, the system completes the enrollment; otherwise, an error is displayed.

33. **UC33-LogDataViewAction**
   - **Description**: Log each time a user views specific data for audit and security purposes.
   - **Actors**: System
   - **Flow**:
     1. User accesses data, such as viewing enrolled courses or student details.
     2. System records the data view action, including timestamp, user ID, role, and data accessed.
     3. Log entry is stored for auditing purposes.

34. **UC34-CheckCreditLimitPerInstructor**
   - **Description**: Ensure an instructor’s assigned courses do not exceed 12 credit hours per semester.
   - **Actors**: System, Staff
   - **Flow**:
     1. Staff assigns a new course to an instructor.
     2. System calculates the instructor’s total assigned credits for the semester.
     3. If the total remains under 12, the course is assigned; otherwise, the system prevents assignment.

35. **UC35-HandleStudentCourseCompletion**
   - **Description**: Calculate a student’s GPA based on completed courses and grades.
   - **Actors**: System, Student, Advisor
   - **Flow**:
     1. System retrieves completed courses and grades for a student.
     2. Calculates GPA based on grade-point mapping.
     3. Displays or logs the GPA for reporting and analysis.

36. **UC36-RestrictDataAccessByRole**
   - **Description**: Limit data visibility based on user roles, ensuring each user can only access authorized information.
   - **Actors**: System, All users
   - **Flow**:
     1. User attempts to access a data item.
     2. System verifies the user’s role and allowed permissions.
     3. If authorized, data is displayed; otherwise, access is denied.

37. **UC37-HandleAdminUpdateCoursePrefix**
   - **Description**: Allows admins to update a course prefix and ensure that the change is consistent across the system.
   - **Actors**: Admin
   - **Flow**:
     1. Admin selects a course to update the prefix or number.
     2. System applies the update and ensures changes reflect across related entities.
     3. Logs the action to maintain consistency.

38. **UC38-VerifyUniqueUsername**
   - **Description**: Verify that usernames are unique across entities to prevent duplication.
   - **Actors**: System
   - **Flow**:
     1. User attempts to create a new account or update username.
     2. System checks if the username already exists.
     3. If unique, the username is accepted; otherwise, an error is shown.

39. **UC39-ViewDepartmentGPARankings**
   - **Description**: Generate rankings for departments based on average student GPA.
   - **Actors**: Admin, Staff
   - **Flow**:
     1. Admin or staff initiates the department ranking report.
     2. System calculates the average GPA per department.
     3. Departments are ranked from highest to lowest and displayed in the report.

40. **UC40-UpdateStudentMajor**
   - **Description**: Allows admins or authorized staff to update a student's major, ensuring validation of the student ID format.
   - **Actors**: Admin, Staff
   - **Flow**:
     1. Admin/staff selects a student and provides the new major ID.
     2. System validates the student ID format and updates the major.
     3. Logs the major update for audit purposes.

41. **UC41-HandleStudentGPARequest**
   - **Description**: Calculate and return the current GPA for a student based on completed courses.
   - **Actors**: System, Student, Advisor
   - **Flow**:
     1. System retrieves all completed courses and grades for the student.
     2. Calculates GPA according to the standard formula.
     3. GPA is displayed or used in further analysis.

42. **UC42-ValidateStudentIDFormat**
   - **Description**: Enforce the format of student IDs to begin with ‘U’ for data consistency.
   - **Actors**: System
   - **Flow**:
     1. User enters a student ID for any operation.
     2. System checks if the student ID starts with ‘U’.
     

---

43. **UC43-ValidateSemesterFormat**
   - **Description**: Enforce that semester entries are valid (spring, fall, or summer).
   - **Actors**: System
   - **Flow**:
     1. User attempts to input a semester value.
     2. System checks that the semester is one of the three accepted values.
     3. If valid, the entry is accepted; otherwise, an error is displayed.

44. **UC44-HandleStudentEnrollInCourse**
   - **Description**: Enroll a student in a course while validating grade input.
   - **Actors**: Student, Advisor, System
   - **Flow**:
     1. Student or advisor selects "Enroll in Course" and provides necessary course and student details.
     2. System validates that the grade provided is valid.
     3. If all checks pass, enrollment is completed and logged.

45. **UC45-GenerateGPAProjectionForAdvisor**
   - **Description**: Allow advisors to calculate a projected GPA for a student based on hypothetical courses.
   - **Actors**: Advisor, System
   - **Flow**:
     1. Advisor provides a student ID and hypothetical course details.
     2. System calculates the projected GPA based on provided courses and grades.
     3. The projected GPA is displayed to the advisor and logged.

46. **UC46-CalculateTotalCreditsForStudent**
   - **Description**: Calculate and return the total number of credits completed by a student.
   - **Actors**: System
   - **Flow**:
     1. System retrieves all completed courses and their credits for a student.
     2. Calculates the sum of credits where the student has passing grades.
     3. Total credits are displayed or used in other calculations, and action is logged.

47. **UC47-CheckInstructorClassTimeConflicts**
   - **Description**: Verify that a new class assignment for an instructor does not overlap with existing class times.
   - **Actors**: Staff, System
   - **Flow**:
     1. Staff attempts to assign an instructor a new course.
     2. System checks the instructor’s existing class times and days for the semester.
     3. If no overlap, assignment proceeds; otherwise, an error is displayed and logged.

48. **UC48-UpdateEnrollmentGrade**
   - **Description**: Update the grade for a student’s enrollment in a specific course.
   - **Actors**: Staff, Instructor, System
   - **Flow**:
     1. Staff or instructor selects "Update Enrollment Grade" and provides student ID, course ID, and new grade.
     2. System validates the new grade value.
     3. If valid, the grade is updated and the action is logged.

49. **UC49-DeleteStudentRecordWithChecks**
   - **Description**: Delete a student’s record if they have no active course enrollments.
   - **Actors**: Admin, System
   - **Flow**:
     1. Admin selects "Delete Student" and provides student ID.
     2. System checks if the student has any active enrollments.
     3. If no active enrollments, the student is deleted and the action is logged; otherwise, an error is displayed.

50. **UC50-DeleteCourseRecordWithChecks**
   - **Description**: Delete a course from the system if it has no active enrollments.
   - **Actors**: Staff, System
   - **Flow**:
     1. Staff selects "Delete Course" and provides the course ID.
     2. System checks if the course has any active enrollments.
     3. If no enrollments are found, the course is deleted and action is logged; otherwise, an error message is shown.

51. **UC51-RetrieveAvailableCourses**
   - **Description**: Display a list of all available courses that students can enroll in.
   - **Actors**: Student, Advisor, System
   - **Flow**:
     1. User requests the list of available courses.
     2. System retrieves course details such as course ID, name, credits, semester, and year.
     3. Available courses are displayed for user selection.

52. **UC52-AssignCourseToInstructor**
   - **Description**: Allow staff to assign an instructor to a course, with checks for department consistency and scheduling constraints.
   - **Actors**: Staff
   - **Flow**:
     1. Staff selects a course and an instructor to assign, along with scheduling information.
     2. System validates that the instructor’s department matches the course’s department and checks for time conflicts.
     3. If valid, the assignment is completed, and the action is logged.

53. **UC53-ValidateGPAWithinRange**
   - **Description**: Ensure that calculated GPAs remain within a 0 to 4 range.
   - **Actors**: System
   - **Flow**:
     1. System calculates GPA for a student.
     2. GPA is checked to ensure it falls within the 0 to 4 scale.
     3. If valid, the GPA is recorded or displayed; if out of range, an error is logged.

54. **UC54-SecureDatabaseConnection**
   - **Description**: Enable secure foreign key support for database operations.
   - **Actors**: System
   - **Flow**:
     1. System connects to the database with foreign key constraints enabled.
     2. Executes operations with data integrity preserved through referential integrity checks.
     3. Any violation of foreign key rules is prevented and logged.

55. **UC55-HandleUserAuthorization**
   - **Description**: Enforce role-based access control to restrict user actions based on their assigned role.
   - **Actors**: System, All users
   - **Flow**:
     1. User attempts an action (e.g., add course, view records).
     2. System checks if the user’s role has permission for that action.
     3. If authorized, the action proceeds; if not, access is denied, and the attempt is logged.

56. **UC56-GenerateDepartmentalGPAReport**
   - **Description**: Provide a report detailing GPA summaries by department.
   - **Actors**: Admin, Staff, System
   - **Flow**:
     1. Admin or staff initiates the generation of a departmental GPA report.
     2. System aggregates GPA data for each department.
     3. The report, including highest, lowest, and average GPA per department, is displayed and logged.

57. **UC57-UpdateCourseDetails**
   - **Description**: Allows staff to update course details, including name, credits, semester, and instructor.
   - **Actors**: Staff, System
   - **Flow**:
     1. Staff selects "Update Course" and provides the updated course details.
     2. System validates new values, ensuring credits are in range, semester is valid, and instructor matches department.
     3. If valid, the course is updated, and the action is logged.

58. **UC58-ViewInstructorTeachingSchedule**
   - **Description**: Allow instructors to view their assigned teaching schedule.
   - **Actors**: Instructor
   - **Flow**:
     1. Instructor selects "View Teaching Schedule".
     2. System retrieves the list of courses assigned to the instructor.
     3. Teaching schedule is displayed, and access is logged.

59. **UC59-GenerateStudentPerformanceReport**
   - **Description**: Provide a report showing a student’s performance across enrolled courses.
   - **Actors**: Instructor, Advisor
   - **Flow**:
     1. Instructor or advisor requests a performance report for a student.
     2. System retrieves grades and credits for each course taken by the student.
     3. The report is displayed and logged for tracking.

---

60. **UC60-AddInstructor**
   - **Description**: Allows staff to add an instructor with a unique username, linked to their department.
   - **Actors**: Staff
   - **Flow**:
     1. Staff provides instructor’s username and department ID.
     2. System checks if the username is unique among instructors.
     3. If unique, instructor is added, and the action is logged.

61. **UC61-GetStudentMajor**
   - **Description**: Retrieve the department major for a specified student.
   - **Actors**: System, Advisor
   - **Flow**:
     1. Advisor requests the major information for a student.
     2. System retrieves the student’s major department.
     3. If found, displays the major or logs an error if not found.

62. **UC62-UpdateCoursePrefixAndNumber**
   - **Description**: Allows admins to update a course prefix or number, ensuring the change is unique.
   - **Actors**: Admin, System
   - **Flow**:
     1. Admin provides the course ID, new prefix, and/or number.
     2. System checks that the new prefix and number combination is unique.
     3. If unique, the course prefix/number is updated; otherwise, an error is shown.

63. **UC63-GetInstructorDepartment**
   - **Description**: Retrieve the department associated with a specific instructor.
   - **Actors**: System, Staff
   - **Flow**:
     1. Staff requests the department information for an instructor.
     2. System retrieves the instructor’s department ID.
     3. If successful, the department is displayed; if not found, an error is logged.

64. **UC64-ViewAllRecordsByAdmin**
   - **Description**: Allow admin to view all data records across system tables for auditing purposes.
   - **Actors**: Admin
   - **Flow**:
     1. Admin selects a table to view records (e.g., students, instructors).
     2. System retrieves and displays all data from the specified table.
     3. Action is logged to track the data viewed by the admin.

65. **UC65-FetchAllAvailableCoursesForEnrollment**
   - **Description**: Fetches all available courses that students can enroll in based on the semester and year.
   - **Actors**: System, Student, Advisor
   - **Flow**:
     1. User requests a list of available courses.
     2. System retrieves all courses that match the current or specified semester.
     3. Displayed courses can be selected by the student or advisor for enrollment, and action is logged.

66. **UC66-EnsureStudentSingleMajor**
   - **Description**: Enforce the rule that each student can only have one major.
   - **Actors**: System, Staff
   - **Flow**:
     1. Staff attempts to assign or update a student’s major.
     2. System checks if the student already has a major assigned.
     3. If a major exists, the system prevents assigning a new major unless an update is intended.

67. **UC67-LogDataViewedByUser**
   - **Description**: Log each time data is viewed by any user for audit and security.
   - **Actors**: System
   - **Flow**:
     1. User accesses specific data (e.g., courses, student information).
     2. System captures the user ID, data type, and timestamp of access.
     3. Log entry is stored for auditing purposes.

68. **UC68-AddStudentToCourseWithValidation**
   - **Description**: Ensure that a student is added to a course only if the student’s department matches the course department.
   - **Actors**: Advisor, System
   - **Flow**:
     1. Advisor provides student ID, course ID, and semester information.
     2. System checks if the student’s department matches the course’s.
     3. If valid, enrollment is completed, and action is logged; otherwise, access is denied.

69. **UC69-AddNewCourseToDatabase**
   - **Description**: Add a new course with details like prefix, number, name, credits, semester, and instructor.
   - **Actors**: Staff, System
   - **Flow**:
     1. Staff inputs course details, including department and instructor assignment.
     2. System validates credits, semester, and unique course ID.
     3. If all checks pass, course is added, and the action is logged.

70. **UC70-CalculateDepartmentRankingsByGPA**
   - **Description**: Calculate GPA rankings for departments based on student performance.
   - **Actors**: System, Admin, Staff
   - **Flow**:
     1. Admin or staff requests department GPA rankings.
     2. System retrieves GPA data and calculates averages per department.
     3. Ranks are displayed, and the report generation is logged.

## Functions by File

1. **menus.py**
   - `display_menu(role)`: Display menu options based on user role.
   - `handle_student_choice(choice, current_user, db_manager)`: Handle menu choices for students.
   - `handle_instructor_choice(choice, current_user, db_manager)`: Handle menu choices for instructors.
   - `handle_advisor_choice(choice, current_user, db_manager)`: Handle menu choices for advisors.
   - `handle_staff_choice(choice, current_user)`: Handle menu choices for staff.
   - `handle_admin_choice(choice, current_user)`: Handle menu choices for administrators.

2. **Database and Data-Related Files**
   - `DatabaseManager`: Class for managing database connections and executing queries.
     - `_connect()`, `_initialize_schema()`, `execute_query()`, `fetch_all()`, `fetch_one()`, `check_uniqueness()`, and other methods for CRUD operations on students, instructors, and courses.
     - Key methods include `add_student()`, `add_course()`, `enroll_student_in_course()`, `update_course()`, `delete_course()`, etc.

3. **Role-Specific Files (student.py, advisor.py, staff.py, instructor.py, admin.py)**
   - **Student**: `view_personal_data()`, `what_if_gpa()`, `suggest_courses_for_target_gpa()`, `view_enrolled_courses()`.
   - **Advisor**: `add_student_to_course()`, `drop_student_from_course()`, `what_if_gpa_for_student()`, `suggest_courses_for_student_gpa_target()`, `view_gpa_summary()`, `view_department_rankings()`.
   - **Instructor**: `view_courses()`, `view_students_in_course()`.
   - **Staff**: `assign_course_to_instructor()`, `update_course()`, `delete_course()`, `generate_course_enrollment_report()`.
   - **Admin**: `view_logs()`, `create_user()`, `update_user()`, `delete_user()`, `view_all_records()`, `generate_report()`.

4. **Analytics and Reporting (analytics/gpa_analysis.py)**
   - `what_if_gpa()`: Calculate GPA based on hypothetical scenarios.
   - `calculate_gpa()`, `calculate_total_credits()`: GPA and credits calculation functions.
   - `generate_gpa_summary()`, `department_gpa_rankings()`, `course_enrollment_report()`: Functions for generating GPA and department reports.

5. **Utilities (utils.py)**
   - `validate_grade()`, `validate_student_id()`, `validate_course_credits()`, `validate_username_uniqueness()`, etc.: Validation functions for enforcing data integrity and business rules.

6. **Authentication and Authorization (auth.py)**
   - `authenticate_user()`: Authenticate user based on role, username, and password.
   - `authorize_access()`: Check permissions based on role.

---

## User Interfaces (UI)

1. **Student UI**: Access to personal data, course enrollment, and GPA analysis tools.
2. **Advisor UI**: Management of student enrollments and GPA summary views.
3. **Instructor UI**: Viewing assigned courses and enrolled students.
4. **Staff UI**: Managing courses, instructors, and generating enrollment reports.
5. **Admin Console**: Access to system logs, user management, and comprehensive reports.

---

## Actors

1. **Students**: Access personal data, view GPA, and use analysis tools for future courses.
2. **Advisors**: Manage student enrollments in courses, suggest courses for GPA improvement.
3. **Instructors**: View and manage information on courses they teach and students enrolled.
4. **Staff**: Handle department-specific data, course assignments, and report generation.
5. **Admin**: System-level access for monitoring logs, managing users, and report generation.

---

## Database Tables

1. **students**: Stores student information and credentials.
2. **advisors**: Advisor data and assigned departments.
3. **instructors**: Instructor details and department association.
4. **staff**: Department staff with access to manage course data.
5. **admin**: Administrator accounts with elevated privileges.
6. **courses**: Course catalog including course IDs, names, credits, semesters, etc.
7. **taken**: Records students enrolled in courses and their grades.
8. **major**: Maps students to their majors.
9. **department**: Department information, including offices and associated majors.
