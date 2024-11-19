import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffManageInstructorsTable from './StaffManageInstructorsTable';

const StaffManageInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [action, setAction] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getStaffInstructors');
                setInstructors(response.data);
            } catch (error) {
                setError('Failed to fetch instructors.');
            }
        };
        fetchInstructors();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/manage_instructors', {
                action,
                id,
                username,
                password,
                department,
            });
            setSuccess(response.data.message);
            setError('');
        } catch (error) {
            setError('Operation failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Manage Instructors</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card p-4 mb-5">
                <h2>Instructor Form</h2>
                <div className="form-group mb-3">
                    <label>ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Department</label>
                    <input
                        type="text"
                        className="form-control"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setAction('add');
                            handleSubmit();
                        }}
                    >
                        Add Instructor
                    </button>
                    <button
                        className="btn btn-warning"
                        onClick={() => {
                            setAction('update');
                            handleSubmit();
                        }}
                    >
                        Update Instructor
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            setAction('delete');
                            handleSubmit();
                        }}
                    >
                        Delete Instructor
                    </button>
                </div>
            </div>
            {/* Table */}
            <StaffManageInstructorsTable instructors={instructors} />
        </div>
    );
};

export default StaffManageInstructors;
