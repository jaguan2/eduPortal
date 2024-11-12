import sqlite3

# Connect to the database
conn = sqlite3.connect('eduPortalDB.db')
cursor = conn.cursor()

# List tables in the database
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:", tables)

# Query each table's content
for table_name, in tables:
    print(f"\nData from table {table_name}:")
    cursor.execute(f"SELECT * FROM {table_name};")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

# Close the connection
conn.close()
