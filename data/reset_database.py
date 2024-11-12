import sqlite3
import subprocess
import os

# Define the paths
DATABASE_PATH = 'eduPortalDB.db'
DB_SETUP_SCRIPT_PATH = 'db_setup.py'

def reset_database():
    """Drops all tables if they exist and re-runs db_setup.py to recreate the tables."""
    with sqlite3.connect(DATABASE_PATH) as conn:
        conn.execute("PRAGMA foreign_keys = OFF;")  # Disable foreign keys to drop all tables safely
        cursor = conn.cursor()

        # Attempt to drop each table if it exists
        tables = ["students", "advisors", "instructors", "staff", "admin", "courses", "taken", "major", "department"]
        for table in tables:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"Dropped table: {table}")
            except sqlite3.OperationalError as e:
                print(f"Error dropping table {table}: {e}")

        conn.commit()
        print("Database tables dropped successfully.")

    # Now run db_setup.py to recreate tables
    try:
        subprocess.run(['python', DB_SETUP_SCRIPT_PATH], check=True)
        print("Database reinitialized successfully by running db_setup.py.")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while running db_setup.py: {e}")

if __name__ == "__main__":
    reset_database()
