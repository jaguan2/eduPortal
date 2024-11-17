import pandas as pd
import sqlite3

# connect to database
db_file = "eduPortalDB.db"
conn = sqlite3.connect(db_file)

# excel file name
excel_file = "temporaryData.xlsx"

student_data = "student_data"
student_df = pd.read_excel(excel_file, sheet_name=student_data)
student_df.to_sql("students", conn, if_exists='replace', index=False)

advisors_data = "advisors_data"
advisors_df = pd.read_excel(excel_file, sheet_name=advisors_data)
advisors_df.to_sql("advisors", conn, if_exists='replace', index=False)

instructors_data = "instructors_data"
instructors_df = pd.read_excel(excel_file, sheet_name=instructors_data)
instructors_df.to_sql("instructors", conn, if_exists='replace', index=False)

staff_data = "staff_data"
staff_df = pd.read_excel(excel_file, sheet_name=staff_data)
staff_df.to_sql("staff", conn, if_exists='replace', index=False)

admin_data = "admin_data"
admin_df = pd.read_excel(excel_file, sheet_name=admin_data)
admin_df.to_sql("admin", conn, if_exists='replace', index=False)

course_data = "course_data"
course_df = pd.read_excel(excel_file, sheet_name=course_data)
course_df.to_sql("courses", conn, if_exists='replace', index=False)

taken_data = "taken_data"
taken_df = pd.read_excel(excel_file, sheet_name=taken_data)
taken_df.to_sql("taken", conn, if_exists='replace', index=False)

major_data = "major_data"
major_df = pd.read_excel(excel_file, sheet_name=major_data)
major_df.to_sql("major", conn, if_exists='replace', index=False)

department_id = "departmentid"
department_df = pd.read_excel(excel_file, sheet_name=department_id)
department_df.to_sql("department", conn, if_exists='replace', index=False)

system_logs = "system_logs"
system_logs_df = pd.read_excel(excel_file, sheet_name=system_logs)
system_logs_df.to_sql("system_logs", conn, if_exists='replace', index=False)

conn.close()