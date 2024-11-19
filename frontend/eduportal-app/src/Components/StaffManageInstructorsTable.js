import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffManageInstructorsTable = () => {
    const [instructors, setInstructors] = useState([]); // State to store instructor data
    const [error, setError] = useState(''); // State for error handling

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                // Fetch data from the backend route
                const response = await axios.get('http://127.0.0.1:5000/getStaffManageInstructors');
                setInstructors(response.data); // Update state with the data
            } catch (err) {
                setError('Failed to fetch instructors.'); // Handle errors
            }
        };

        fetchInstructors(); // Trigger fetch when the component mounts
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Instructors in Your Department</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Instructor ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Password</th>
                    </tr>
                </thead>
                <tbody>
                    {instructors.map((instructor) => (
                        <tr key={instructor.instructor_id}>
                            <td>{instructor.instructor_id}</td>
                            <td>{instructor.username}</td>
                            <td>{instructor.password}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffManageInstructorsTable;
