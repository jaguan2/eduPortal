// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './StaffAssigningInstructorsPage.css';

// const AssignInstructorsPage = () => {
//     const [courses, setCourses] = useState([]);
//     const [instructors, setInstructors] = useState([]);
//     const [courseId, setCourseId] = useState('');
//     const [instructorId, setInstructorId] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     // Fetch courses and instructors on load
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const coursesResponse = await axios.get('http://127.0.0.1:5000/get_courses', {
//                     params: { department_id: 1 }, // Example department ID
//                 });
//                 const instructorsResponse = await axios.get('http://127.0.0.1:5000/get_instructors', {
//                     params: { department_id: 1 },
//                 });
//                 setCourses(coursesResponse.data);
//                 setInstructors(instructorsResponse.data);
//             } catch (error) {
//                 setError('Failed to fetch data.');
//             }
//         };
//         fetchData();
//     }, []);

//     const handleAssignInstructor = async () => {
//         if (!courseId || !instructorId) {
//             setError('Course ID and Instructor ID are required.');
//             return;
//         }
//         setLoading(true);
//         setError('');
//         setSuccess('');
//         try {
//             const response = await axios.post('http://127.0.0.1:5000/assign_course', {
//                 course_id: courseId,
//                 instructor_id: instructorId,
//                 department_id: 1, // Replace with dynamic department ID
//                 user_id: 1,       // Replace with dynamic user ID
//                 username: 'staff_user',
//             });
//             setSuccess(response.data.message);
//             setCourseId('');
//             setInstructorId('');
//         } catch (error) {
//             setError('Failed to assign instructor. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center mb-4">Assign Instructors</h1>
//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">{success}</div>}

//             <div className="row">
//                 {/* Courses Table */}
//                 <div className="col-md-6">
//                     <h2>Courses</h2>
//                     <table className="table table-bordered mt-3">
//                         <thead className="thead-light">
//                             <tr>
//                                 <th>Course ID</th>
//                                 <th>Course Name</th>
//                                 <th>Instructor ID</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {courses.map((course) => (
//                                 <tr key={course.course_id}>
//                                     <td>{course.course_id}</td>
//                                     <td>{course.course_name}</td>
//                                     <td>{course.instructor}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Instructors Table */}
//                 <div className="col-md-6">
//                     <h2>Instructors</h2>
//                     <table className="table table-bordered mt-3">
//                         <thead className="thead-light">
//                             <tr>
//                                 <th>Instructor ID</th>
//                                 <th>Username</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {instructors.map((instructor) => (
//                                 <tr key={instructor.instructor_id}>
//                                     <td>{instructor.instructor_id}</td>
//                                     <td>{instructor.username}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             <div className="card p-4 mt-4">
//                 <h2>Assign Instructor</h2>
//                 <div className="form-group mb-3">
//                     <label htmlFor="courseId">Course ID</label>
//                     <input
//                         type="text"
//                         id="courseId"
//                         className="form-control"
//                         placeholder="Enter course ID"
//                         value={courseId}
//                         onChange={(e) => setCourseId(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label htmlFor="instructorId">Instructor ID</label>
//                     <input
//                         type="text"
//                         id="instructorId"
//                         className="form-control"
//                         placeholder="Enter instructor ID"
//                         value={instructorId}
//                         onChange={(e) => setInstructorId(e.target.value)}
//                     />
//                 </div>
//                 <button className="btn btn-primary w-100" onClick={handleAssignInstructor} disabled={loading}>
//                     {loading ? 'Assigning...' : 'Assign Instructor'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AssignInstructorsPage;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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
                const coursesResponse = await axios.get('http://127.0.0.1:5000/get_courses', {
                    params: { department_id: 1 }, // Example department ID
                });
                const instructorsResponse = await axios.get('http://127.0.0.1:5000/get_instructors', {
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
            const response = await axios.post('http://127.0.0.1:5000/assign_course', {
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

            <div className="row">
                <div className="col-md-6">
                    <h2 className="text-center">Courses</h2>
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Course ID</th>
                                <th scope="col">Course Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.course_id}>
                                    <td>{course.course_id}</td>
                                    <td>{course.course_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="col-md-6">
                    <h2 className="text-center">Instructors</h2>
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Instructor ID</th>
                                <th scope="col">Name</th>
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

            <div className="card mt-4">
                <div className="card-body">
                    <h3>Assign Instructor to Course</h3>
                    <div className="form-group mb-3">
                        <label htmlFor="courseId">Course ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="courseId"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="instructorId">Instructor ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="instructorId"
                            value={instructorId}
                            onChange={(e) => setInstructorId(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleAssignInstructor}
                        disabled={loading}
                    >
                        {loading ? 'Assigning...' : 'Assign Instructor'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignInstructorsPage;
