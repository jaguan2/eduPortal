import sqlite3;
import sqlalchemy;

conn = sqlite3.connect('eduPortalDB.db')
cursor = conn.cursor()

studentsTableQuery = '''create table if not exists students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    major INTEGER,
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
    number INTEGER(4),
    courseName VARCHAR(255),
    credits INTEGER,
    semester VARCHAR(2),
    year INTEGER,
    classTime VARCHAR(255),
    classDay VARCHAR(20),  -- Added classDay column
    instructor INTEGER,
    FOREIGN KEY (instructor) REFERENCES instructors(id)
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
