import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StaffAssigningInstructorsPage.css';

const AssignInstructorsPage = () => {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch courses and instructors on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesResponse = await axios.get('http://127.0.0.1:5000/getStaffCourses', {
                    params: { department_id: 1 }, // Example department ID
                });
                const instructorsResponse = await axios.get('http://127.0.0.1:5000/getStaffInstructors', {
                    params: { department_id: 1 },
                });
                setCourses(coursesResponse.data);
                setInstructors(instructorsResponse.data);
            } catch (error) {
                setError('Failed to fetch data.');
            }
        };
        fetchData();
    }, []);

    const handleAssignInstructor = async () => {
        if (!courseId || !instructorId) {
            setError('Course ID and Instructor ID are required.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/assign_instructors', {
                course_id: courseId,
                instructor_id: instructorId,
                department_id: 1, // Replace with dynamic department ID
                user_id: 1,       // Replace with dynamic user ID
                username: 'staff_user',
            });
            setSuccess(response.data.message);
            setCourseId('');
            setInstructorId('');
        } catch (error) {
            setError('Failed to assign instructor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Assign Instructors</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Form Section */}
            <div className="card p-4 mt-4">
                <h2>Assign Instructor</h2>
                <div className="form-group mb-3">
                    <label htmlFor="courseId">Course ID</label>
                    <input
                        type="text"
                        id="courseId"
                        className="form-control"
                        placeholder="Enter course ID"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="instructorId">Instructor ID</label>
                    <input
                        type="text"
                        id="instructorId"
                        className="form-control"
                        placeholder="Enter instructor ID"
                        value={instructorId}
                        onChange={(e) => setInstructorId(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary w-100" onClick={handleAssignInstructor} disabled={loading}>
                    {loading ? 'Assigning...' : 'Assign Instructor'}
                </button>
            </div>

            {/* Tables Section */}
            <div className="row">
                {/* Courses Table */}
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

                {/* Instructors Table */}
                <div className="col-md-6">
                    <h2>Instructors</h2>
                    <table className="table table-bordered mt-3">
                        <thead className="thead-light">
                            <tr>
                                <th>Instructor ID</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructors.map((instructor) => (
                                <tr key={instructor.instructor_id}>
                                    <td>{instructor.instructor_id}</td>
                                    <td>{instructor.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssignInstructorsPage;
