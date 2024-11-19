import React, { useState } from 'react';
import Profile from '../Components/SystemAdminProfile';
import SystemAdminNavigation from '../Components/SystemAdminNavigation';
import LogsTable from '../Components/SystemAdminLogsTable';
import SystemAdminGPAStatisticsTable from '../Components/SystemAdminGPAStatisticsTable';
import DepartmentGPATable from '../Components/SystemAdminDepartmentGPATable';
import SystemAdminSemesterCourseStatsTable from '../Components/SystemAdminSemesterCourseStatsTable';
import InstructorStudentsByMajorTable from '../Components/SystemInstructorByStudentsMajorTable';
import ListStudentsByMajorTable from '../Components/SystemAdminStudentsByMajorTable';
import './SystemAdminDashboard.css';

const SystemAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('logs'); // Track which table is active

    // Logout function to redirect to login page
    const handleLogout = () => {
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <div className="SystemAdminDashboard container text-center">
            {/* Row 1: System Admin Head */}
            <div className="SystemAdminHead row align-items-center mb-5">
                {/* Profile */}
                <div className="col-12 col-md-4 d-flex justify-content-md-start">
                    <Profile />
                </div>

                {/* Logout Button */}
                <div className="col-12 col-md-8 d-flex justify-content-md-end">
                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        Log Out
                    </button>
                </div>
            </div>

            {/* Row 2: Button Toggle */}
            <div className="row mb-4 justify-content-center">
                <div className="btn-group">
                    <button
                        className={`btn btn-outline-primary ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        Logs
                    </button>
                    <button
                        className={`btn btn-outline-secondary ${activeTab === 'gpa' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gpa')}
                    >
                        Major GPA Rankings
                    </button>
                    <button
                        className={`btn btn-outline-success ${activeTab === 'department_gpa' ? 'active' : ''}`}
                        onClick={() => setActiveTab('department_gpa')}
                    >
                        Department GPA Rankings
                    </button>
                    <button
                        className={`btn btn-outline-info ${activeTab === 'course_stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('course_stats')}
                    >
                        Semester Course Statistics
                    </button>
                    <button
                        className={`btn btn-outline-warning ${activeTab === 'instructor_students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('instructor_students')}
                    >
                        Instructor Students by Major
                    </button>
                    <button
                        className={`btn btn-outline-dark ${activeTab === 'students_by_major' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students_by_major')}
                    >
                        Students by Major
                    </button>
                </div>
            </div>

            {/* Row 3: Render Tables */}
            <div className="row">
                {activeTab === 'logs' && (
                    <div className="col">
                        <LogsTable />
                    </div>
                )}
                {activeTab === 'gpa' && (
                    <div className="col">
                        <SystemAdminGPAStatisticsTable />
                    </div>
                )}
                {activeTab === 'department_gpa' && (
                    <div className="col">
                        <DepartmentGPATable />
                    </div>
                )}
                {activeTab === 'course_stats' && (
                    <div className="col">
                        <SystemAdminSemesterCourseStatsTable />
                    </div>
                )}
                {activeTab === 'instructor_students' && (
                    <div className="col">
                        <InstructorStudentsByMajorTable />
                    </div>
                )}
                {activeTab === 'students_by_major' && (
                    <div className="col">
                        <ListStudentsByMajorTable />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemAdminDashboard;
