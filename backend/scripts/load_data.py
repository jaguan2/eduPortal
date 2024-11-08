# Load data helper (temporaryData.xlsx)
# 0. cd backend
# 1. rm eduPortalDB.db
# 2. python tableInitialization.py
# 3. python scripts/load_data.py

import pandas as pd
import sqlite3

# Define paths
excel_path = 'data/temporaryData.xlsx'  # Path to the Excel file
db_path = 'eduPortalDB.db'              # Path to the SQLite database

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Dictionary to map sheet names in Excel to table names in SQLite
sheet_to_table_map = {
    'student_data': 'students',
    'advisors_data': 'advisors',
    'instructors_data': 'instructors',
    'staff_data': 'staff',
    'admin_data': 'admin',
    'course_data': 'courses',
    'taken_data': 'taken',
    'major_data': 'major',
    'departmentid': 'department'
}

# Clear data from each table before inserting new data
for table_name in sheet_to_table_map.values():
    cursor.execute(f"DELETE FROM {table_name}")

# Commit the deletion
conn.commit()

# Load and insert data for each table
for sheet_name, table_name in sheet_to_table_map.items():
    df = pd.read_excel(excel_path, sheet_name=sheet_name)
    df.to_sql(table_name, conn, if_exists='append', index=False)

# Close the connection
conn.close()

print("Data successfully loaded into the database.")
