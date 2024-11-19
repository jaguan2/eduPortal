import React from 'react';
import './StudentDashboard.css';
import StudentNavigation from '../Components/StudentNavigation';
import CourseTable from '../Components/StudentCourseTable';
import Profile from '../Components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentDashboard = () => {
    return (

        <div className="StudentDashboard container text-center">
            {/* Row 1: Student Head */}
            <div className="StudentHead row align-items-center mb-5">
                {/* Profile */}
                <div className="col"> {/* col-12 for small screens, col-md-4 for medium and up */}
                    <Profile />
                </div>

                {/* Student Navigation */}
                <div className="col d-flex justify-content-end"> {/* col-12 for small screens, col-md-8 for medium and up */}
                    <StudentNavigation />
                </div>
            </div>

            {/* Row 2: Course Title */}
            <div className="StudentCoursesTitle row mb-3">
                <div className="col">
                    <h3>Course List</h3>
                </div>
            </div>
            
            {/* Row 3: Course Table */}
            <div className="StudentCourseList row">
                <div className="col">
                    <CourseTable />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;