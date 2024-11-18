
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const ManageAndAssignPage = () => {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesResponse = await axios.get('http://127.0.0.1:5000/get_courses', { params: { department_id: 1 } });
                const instructorsResponse = await axios.get('http://127.0.0.1:5000/get_instructors', { params: { department_id: 1 } });
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
            const response = await axios.post('http://127.0.0.1:5000/assign_course', {
                course_id: courseId,
                instructor_id: instructorId,
                department_id: 1,
                user_id: 1,
                username: 'staff_user',
            });
            setSuccess(response.data.message);
        } catch (error) {
            setError('Failed to assign instructor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Manage Courses & Assign Instructors</h1>
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
                    <h2>Instructors</h2>
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Instructor ID</th>
                                <th>Instructor Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructors.map(instructor => (
                                <tr key={instructor.instructor_id}>
                                    <td>{instructor.instructor_id}</td>
                                    <td>{instructor.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-body">
                    <h3>Assign Instructor</h3>
                    <div className="form-group mb-3">
                        <label>Course ID</label>
                        <input type="text" className="form-control" value={courseId} onChange={e => setCourseId(e.target.value)} />
                    </div>
                    <div className="form-group mb-3">
                        <label>Instructor ID</label>
                        <input type="text" className="form-control" value={instructorId} onChange={e => setInstructorId(e.target.value)} />
                    </div>
                    <button className="btn btn-primary w-100" onClick={handleAssignInstructor} disabled={loading}>
                        {loading ? 'Assigning...' : 'Assign Instructor'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageAndAssignPage;
