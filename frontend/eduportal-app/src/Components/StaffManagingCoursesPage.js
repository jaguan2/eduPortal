
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const ManageCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [coursePrefix, setCoursePrefix] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/get_courses', { params: { department_id: 1 } });
                setCourses(response.data);
            } catch (error) {
                setError('Failed to fetch courses.');
            }
        };
        fetchCourses();
    }, []);

    const handleAddCourse = async () => {
        if (!coursePrefix || !courseNumber) {
            setError('Both course prefix and number are required.');
            return;
        }
        const courseCode = `${coursePrefix} ${courseNumber}`;
        try {
            const response = await axios.post('http://127.0.0.1:5000/manage_course', {
                action: 'add',
                courseName: courseCode,
                department_id: 1,
            });
            setSuccess(response.data.message);
            setCoursePrefix('');
            setCourseNumber('');
        } catch (error) {
            setError('Failed to add course.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Manage Courses</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row">
                <div className="col-md-6">
                    <h2>Courses</h2>
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.course_id}>
                                    <td>{course.course_id}</td>
                                    <td>{course.course_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3>Add New Course</h3>
                            <div className="form-group mb-3">
                                <label>Course Prefix</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={coursePrefix}
                                    onChange={e => setCoursePrefix(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Course Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={courseNumber}
                                    onChange={e => setCourseNumber(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary w-100" onClick={handleAddCourse}>
                                Add Course
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCoursesPage;
