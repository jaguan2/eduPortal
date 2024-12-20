import sqlite3;
import sqlalchemy;

conn = sqlite3.connect('eduPortalDB.db')
cursor = conn.cursor()

# NOTE: Must create check constraint on gpa to make it between 0 and 4
studentsTableQuery = '''create table if not exists students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    major INTEGER,
    gpa DOUBLE CHECK (gpa >= 0 AND gpa <= 4),
    FOREIGN KEY (major) REFERENCES major(id)
    );'''
conn.execute(studentsTableQuery)

advisorsTableQuery = '''create table if not exists advisors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    department INTEGER,
    FOREIGN KEY (department) REFERENCES department(id)
    );'''
conn.execute(advisorsTableQuery)

instructorsTableQuery = '''create table if not exists instructors(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    department INTEGER,
    FOREIGN KEY (department) REFERENCES department(id)
    );'''
conn.execute(instructorsTableQuery)

staffTableQuery = '''create table if not exists staff(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    department INTEGER,
    FOREIGN KEY (department) REFERENCES department(id)
    );'''
conn.execute(staffTableQuery)

adminTableQuery = '''create table if not exists admin(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255),
    password VARCHAR(255)
    );'''
conn.execute(adminTableQuery)

courseTableQuery = '''create table if not exists courses(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prefix CHAR(3),
    number VARCHAR(4),
    courseName VARCHAR(255),
    credits INTEGER,
    semester VARCHAR(2),
    year INTEGER,
    classTime VARCHAR(255),
    classDay VARCHAR(5),
    instructor INTEGER,
    department INTEGER,
    FOREIGN KEY (instructor) REFERENCES instructors(id),
    FOREIGN KEY (department) REFERENCES department(id)
    );'''
conn.execute(courseTableQuery)

takenTableQuery = '''create table if not exists taken(
    student INTEGER,
    course INTEGER,
    grade VARCHAR(5),
    FOREIGN KEY (student) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course) REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (student, course)
    );'''
conn.execute(takenTableQuery)

majorTableQuery = '''create table if not exists major(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    majorName VARCHAR(255),
    department INTEGER,
    FOREIGN KEY (department) REFERENCES department(id)
    );'''
conn.execute(majorTableQuery)

departmentTableQuery = '''create table if not exists department(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    departmentName VARCHAR(255),
    building VARCHAR(50),
    office INTEGER
    );'''
conn.execute(departmentTableQuery)

systemLogsTableQuery = '''
CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    username TEXT,
    operation_type TEXT CHECK (operation_type IN ('READ', 'WRITE', 'DELETE', 'UPDATE')),
    table_name TEXT,
    affected_data TEXT,
    operation_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
'''
conn.execute(systemLogsTableQuery)
