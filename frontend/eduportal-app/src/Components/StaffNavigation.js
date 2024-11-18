
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StaffNavigation = () => {
    const [UID, setUID] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uidResponse = await axios.get('http://127.0.0.1:5000/getID');
                const departmentResponse = await axios.get('http://127.0.0.1:5000/getDepartment');
                setUID(uidResponse.data.uid);
                setDepartment(departmentResponse.data.department);
            } catch (error) {
                setError('Failed to fetch user data.');
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="container mt-3">
            <div className="alert alert-info">
                <h4>Staff Information</h4>
                <p>UID: {UID || 'Loading...'}</p>
                <p>Department: {department || 'Loading...'}</p>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <nav className="mt-3">
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link to="/manage-courses">Manage Courses</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/assign-instructors">Assign Instructors</Link>
                    </li>
                    <li className="list-group-item">
                        <Link to="/manage-assign">Manage Courses & Assign Instructors</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default StaffNavigation;
