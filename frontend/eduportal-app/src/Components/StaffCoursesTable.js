import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffCoursesTable = ({ courses }) => {
    return (
        <div className="col-md-12">
            <h2 className="text-center">Courses</h2>
            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th scope="col">Course ID</th>
                        <th scope="col">Prefix</th>
                        <th scope="col">Number</th>
                        <th scope="col">Course Name</th>
                        <th scope="col">Credits</th>
                        <th scope="col">Semester</th>
                        <th scope="col">Year</th>
                        <th scope="col">Class Time</th>
                        <th scope="col">Class Day</th>
                        <th scope="col">Instructor ID</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.prefix}</td>
                            <td>{course.number}</td>
                            <td>{course.courseName}</td>
                            <td>{course.credits}</td>
                            <td>{course.semester}</td>
                            <td>{course.year}</td>
                            <td>{course.classTime}</td>
                            <td>{course.classDay}</td>
                            <td>{course.instructor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffCoursesTable;
