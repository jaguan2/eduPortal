import React from 'react';
import './StudentDashboard.css'
import StudentNavigation from './StudentNavigation';
import CourseTable from './StudentCourseTable';
import Profile from './Profile';

const StudentDashboard = () => {
    return (
        <div className="StudentDashboard">
            <Profile/>
            <StudentNavigation/>
            <CourseTable/>
        </div>
    );
}

export default StudentDashboard