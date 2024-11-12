# tests/test_gpa_calculations_and_reports.py
# python -m unittest discover tests

import unittest
import subprocess
import os
import sqlite3

from src.analytics.gpa_analysis import (
    calculate_gpa,
    calculate_total_credits,
    what_if_gpa,
    generate_gpa_summary,
    department_gpa_rankings
)
from src.core.utils import grade_to_points

RESET_DB_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../data/reset_database.py")

class TestGPACalculationsAndReports(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        subprocess.run(['python', RESET_DB_SCRIPT_PATH], check=True)
        
    def test_calculate_gpa(self):
        # Test GPA calculation with a list of courses
        courses = [
            {'credits': 3, 'grade': 'A'},
            {'credits': 4, 'grade': 'B'},
            {'credits': 3, 'grade': 'C'}
        ]
        expected_gpa = (3 * 4.0 + 4 * 3.0 + 3 * 2.0) / 10  # Should yield 3.0
        self.assertAlmostEqual(calculate_gpa(courses), expected_gpa)

    def test_calculate_gpa_no_courses(self):
        # Edge case: No courses should result in GPA of 0
        courses = []
        self.assertEqual(calculate_gpa(courses), 0.0)

    def test_calculate_total_credits(self):
        # Test total credits calculation
        courses = [
            {'credits': 3, 'grade': 'A'},
            {'credits': 4, 'grade': 'B'},
            {'credits': 2, 'grade': 'F'}  # Should not be counted in total credits
        ]
        expected_credits = 7  # Only 'A' and 'B' grades count
        self.assertEqual(calculate_total_credits(courses), expected_credits)

    def test_calculate_gpa_range(self):
        courses = [{'credits': 3, 'grade': 'A'}, {'credits': 4, 'grade': 'B'}]
        gpa = calculate_gpa(courses)
        self.assertGreaterEqual(gpa, 0.0)
        self.assertLessEqual(gpa, 4.0)

    def test_what_if_gpa(self):
        # Test What-If GPA calculation with current GPA and additional courses
        current_gpa = 3.5
        completed_credits = 30
        additional_courses = [
            {'credits': 3, 'grade': 'A'},
            {'credits': 4, 'grade': 'B'}
        ]
        new_gpa = what_if_gpa(current_gpa, completed_credits, additional_courses)
        # Expected GPA should be calculated manually for accuracy
        total_points = 3.5 * 30 + (3 * 4.0) + (4 * 3.0)
        total_credits = 30 + 3 + 4
        expected_gpa = total_points / total_credits
        self.assertAlmostEqual(new_gpa, expected_gpa)

    def test_generate_gpa_summary(self):
        # Test GPA summary generation
        students_by_major = {
            "CS": [
                {'courses': [{'credits': 3, 'grade': 'A'}, {'credits': 4, 'grade': 'B'}]},
                {'courses': [{'credits': 3, 'grade': 'C'}, {'credits': 4, 'grade': 'A'}]}
            ],
            "Math": [
                {'courses': [{'credits': 3, 'grade': 'B'}, {'credits': 4, 'grade': 'C'}]},
            ]
        }
        summary = generate_gpa_summary(students_by_major)
        # Check the calculated summary for each major
        self.assertIn("CS", summary)
        self.assertIn("Math", summary)
        self.assertIsNotNone(summary["CS"]["highest"])
        self.assertIsNotNone(summary["CS"]["lowest"])
        self.assertIsNotNone(summary["CS"]["average"])

    def test_department_gpa_rankings(self):
        # Test department ranking by GPA
        departments = {
            "CS": [{'gpa': 3.5}, {'gpa': 3.7}],
            "Math": [{'gpa': 3.2}, {'gpa': 3.0}],
            "Physics": [{'gpa': 2.8}]
        }
        rankings = department_gpa_rankings(departments)
        expected_rankings = [("CS", 3.6), ("Math", 3.1), ("Physics", 2.8)]
        self.assertEqual(rankings, expected_rankings)

if __name__ == "__main__":
    unittest.main()
