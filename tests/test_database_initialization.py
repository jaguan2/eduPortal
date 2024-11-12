# tests/test_database_initialization.py
# python -m unittest discover tests
import unittest
import subprocess
import os
import sqlite3

RESET_DB_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../data/reset_database.py")

class TestDatabaseSchema(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Connect to the SQLite database for the test session
        subprocess.run(['python', RESET_DB_SCRIPT_PATH], check=True)
        cls.conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), "../data/eduPortalDB.db"))
        cls.cursor = cls.conn.cursor()
        # Expected tables and their schemas (simplified example)
        cls.expected_tables = {
            "students": ["id", "username", "password", "major"],
            "advisors": ["id", "username", "password", "department"],
            "instructors": ["id", "username", "password", "department"],
            "staff": ["id", "username", "password", "department"],
            "admin": ["id", "username", "password"],
            "courses": ["id", "prefix", "number", "courseName", "credits", "semester", "year", "classTime", "classDay", "instructor"],
            "taken": ["student", "course", "grade"],
            "major": ["id", "majorName", "department"],
            "department": ["id", "departmentName", "building", "office"]
        }

    def test_tables_exist_and_schema(self):
        for table, expected_columns in self.expected_tables.items():
            with self.subTest(table=table):
                # Check if table exists
                self.cursor.execute(f"PRAGMA table_info({table})")
                schema = self.cursor.fetchall()
                
                # Assert table existence
                self.assertTrue(schema, f"Table {table} does not exist.")
                
                # Get actual column names from schema
                actual_columns = [col[1] for col in schema]
                
                # Verify that all expected columns are in the table
                self.assertEqual(actual_columns, expected_columns, f"Schema mismatch for table {table}. Expected columns: {expected_columns}, found: {actual_columns}")

    @classmethod
    def tearDownClass(cls):
        # Close the database connection after all tests
        cls.conn.close()

if __name__ == "__main__":
    unittest.main()
