import React from 'react';
import './StudentDashboard.css'
import StudentNavigation from '../Components/StudentNavigation';
import CourseTable from '../Components/StudentCourseTable';
import Profile from '../Components/Profile';

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