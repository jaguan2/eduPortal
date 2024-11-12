# Load data helper (temporaryData.xlsx)
# 0. cd backend
# 1. rm eduPortalDB.db
# 2. python tableInitialization.py
# 3. python scripts/load_data.py

import pandas as pd
import sqlite3

# Define paths
excel_path = 'temporaryData.xlsx'  # Path to the Excel file
db_path = 'eduPortalDB.db'              # Path to the SQLite database

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
conn.execute("PRAGMA foreign_keys = ON;")
cursor = conn.cursor()

# Dictionary to map sheet names in Excel to table names in SQLite
sheet_to_table_map = {
    'departmentid': 'department',   # Independent table, no foreign keys
    'major_data': 'major',          # Relies on department
    'student_data': 'students',     # Relies on major
    'advisors_data': 'advisors',    # Relies on department
    'instructors_data': 'instructors',  # Relies on department
    'staff_data': 'staff',          # Relies on department
    'admin_data': 'admin',          # Independent
    'course_data': 'courses',       # Relies on instructors
    'taken_data': 'taken'           # Relies on students and courses
}

# Temporarily disable foreign key constraints
conn.execute("PRAGMA foreign_keys = OFF;")

for table_name in sheet_to_table_map.values():
    cursor.execute(f"DELETE FROM {table_name}")

# Re-enable foreign key constraints
conn.execute("PRAGMA foreign_keys = ON;")
conn.commit()

# Load and insert data for each table
for sheet_name, table_name in sheet_to_table_map.items():
    try:
        df = pd.read_excel(excel_path, sheet_name=sheet_name)
        df.to_sql(table_name, conn, if_exists='append', index=False)
        print(f"Loaded data into {table_name} from sheet {sheet_name}")
    except Exception as e:
        print(f"Failed to load data into {table_name} from sheet {sheet_name}: {e}")

# Close the connection
conn.close()

print("Data successfully loaded into the database.")