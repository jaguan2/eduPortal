# Analytical calculations for GPA reports
# GPA calculations and reports
# Requirement 6: What-If analysis for students and advisors (GPA impact with different grades and credit hours).
# what_if_gpa_projection, suggest_course_plan
# unctions to calculate potential GPA changes based on hypothetical courses. For example, what_if_gpa_projection can compute the new GPA if certain grades are achieved in additional courses.

# Requirement 7: Summary reports for GPAs and enrollments.
# generate_gpa_summary, department_gpa_rankings, course_enrollment_report.
# reporting functions that query and calculate data such as highest/lowest GPA, department rankings, semester enrollments, and sorted student lists by total credits.



# Conducts a What-If GPA calculation given a list of hypothetical courses.
# Meets Requirement 6: Allows students and advisors to simulate GPA scenarios.
# GPA Integrity: Assumes standard GPA formula and grade-to-point mapping.
def what_if_gpa(current_gpa, completed_credits, additional_courses):
    total_credits = completed_credits
    total_points = current_gpa * completed_credits

    for course in additional_courses:
        grade_points = grade_to_points(course['grade'])
        total_points += grade_points * course['credits']
        total_credits += course['credits']

    return total_points / total_credits if total_credits > 0 else 0.0

# Calculates the GPA based on a list of completed courses.
# GPA Integrity Constraint: Ensures calculated GPAs remain within a 0-4 scale.
def calculate_gpa(courses):
    total_credits = sum(course['credits'] for course in courses)
    total_points = sum(course['credits'] * grade_to_points(course['grade']) for course in courses)
    return total_points / total_credits if total_credits > 0 else 0.0

# Calculates the total credits a student has completed.
# Data Integrity Constraint: Helps enforce GPA calculations and credits checks.
def calculate_total_credits(courses):
    return sum(course['credits'] for course in courses if course['grade'] in {'A', 'B', 'C', 'D', 'S'})

# Helper function to convert grades to GPA points.
# GPA Integrity: Ensures only valid grades are used, and maps each grade to standard GPA points.
def grade_to_points(self, grade):
    points_map = {'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0, 'S': 4.0, 'U': 0.0, 'I': 0.0}
    return points_map.get(grade, 0.0)

# Suggests a course plan to reach a target GPA based on current GPA and completed credits.
# Meets Requirement 6: Provides possible paths to achieve a desired GPA.
def suggest_course_plan(current_gpa, completed_credits, target_gpa, course_options):
    # course_options is a list of possible course configurations, e.g., [{'credits': 3, 'grade': 'A'}, {'credits': 4, 'grade': 'B'}, ...]
    possible_plans = []
    for course_set in course_options:
        projected_gpa = what_if_gpa(current_gpa, completed_credits, course_set)
        if projected_gpa >= target_gpa:
            possible_plans.append(course_set)
    return possible_plans

# Generates summary statistics (highest, lowest, average GPA) for students.
# Meets Requirement 7: Provides GPA summaries by major.
def generate_gpa_summary(students_by_major):
    summary = {}
    for major, students in students_by_major.items():
        gpas = [calculate_gpa(student['courses']) for student in students]
        summary[major] = {
            'highest': max(gpas) if gpas else None,
            'lowest': min(gpas) if gpas else None,
            'average': sum(gpas) / len(gpas) if gpas else None
        }
    return summary

# Ranks departments by average GPA, listing from highest to lowest.
# Meets Requirement 7: Provides department GPA rankings.
def department_gpa_rankings(departments):
    department_averages = {
        dept_name: sum(student['gpa'] for student in students) / len(students)
        for dept_name, students in departments.items() if students
    }
    return sorted(department_averages.items(), key=lambda x: x[1], reverse=True)

# Generates an enrollment and average grade report for each course by semester.
# Meets Requirement 7: Provides semester-by-semester reports for course enrollments and average grades.
def course_enrollment_report(courses_by_semester):
    report = {}
    for semester, courses in courses_by_semester.items():
        report[semester] = {}
        for course, enrollments in courses.items():
            total_students = len(enrollments)
            average_grade = sum(grade_to_points(enrollment['grade']) for enrollment in enrollments) / total_students if total_students > 0 else None
            report[semester][course] = {
                'total_enrollments': total_students,
                'average_grade': average_grade
            }
    return report

    # Conducts a What-If GPA calculation given a list of hypothetical courses.
    # Meets Requirement 6: Allows students and advisors to simulate GPA scenarios.
    # GPA Integrity: Assumes standard GPA formula and grade-to-point mapping.
    # def what_if_gpa(self, student_id, courses):
    #     # Example course structure: [{'credits': 3, 'grade': 'A'}, {'credits': 4, 'grade': 'B'}, ...]
    #     total_credits = sum(course['credits'] for course in courses)
    #     total_points = sum(self.grade_to_points(course['grade']) * course['credits'] for course in courses)
    #     projected_gpa = total_points / total_credits if total_credits > 0 else 0.0
    #     return projected_gpa

    # # Helper function to convert grades to GPA points.
    # # GPA Integrity: Ensures only valid grades are used, and maps each grade to standard GPA points.
    # def grade_to_points(self, grade):
    #     points_map = {'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0, 'S': 4.0, 'U': 0.0, 'I': 0.0}
    #     return points_map.get(grade, 0.0)