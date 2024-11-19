import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ManageCoursesPage from './StaffManagingCoursesPage';
import AssignInstructorsPage from './StaffAssigningInstructorsPage';
import './StaffNavigation.css';

const StaffNavigation = () => {
    const [UID, setUID] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState('manage_courses'); // Track active page

    useEffect(() => {
        const fetchUID = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getStaffID');
                setUID(response.data.uid || 'Unknown');
            } catch (error) {
                setError('Failed to fetch UID');
            }
        };

        const fetchDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getStaffDepartment');
                setDepartment(response.data.department || 'Unknown');
            } catch (error) {
                setError('Failed to fetch Department');
            }
        };

        fetchUID();
        fetchDepartment();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row mb-4 align-items-center">
                {error ? (
                    <div className="col text-danger">
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="col-md-4">
                            <div className="Info">
                                <div className="InfoLabel">UID:</div>
                                <div className="InfoData">{UID || 'Loading...'}</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="Info">
                                <div className="InfoLabel">Department:</div>
                                <div className="InfoData">{department || 'Loading...'}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Button Toggle Group */}
            <div className="row mb-4 justify-content-center">
                <div className="btn-group">
                    <button
                        className={`btn btn-outline-primary ${activePage === 'manage_courses' ? 'active' : ''}`}
                        onClick={() => setActivePage('manage_courses')}
                    >
                        Manage Courses
                    </button>
                    <button
                        className={`btn btn-outline-secondary ${activePage === 'assign_instructors' ? 'active' : ''}`}
                        onClick={() => setActivePage('assign_instructors')}
                    >
                        Assign Instructors
                    </button>
                </div>
            </div>

            {/* Render Active Page */}
            <div className="row">
                {activePage === 'manage_courses' && <ManageCoursesPage />}
                {activePage === 'assign_instructors' && <AssignInstructorsPage />}
            </div>
        </div>
    );
};

export default StaffNavigation;