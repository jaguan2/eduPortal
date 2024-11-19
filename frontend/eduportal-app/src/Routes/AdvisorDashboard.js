import React from 'react';
import './AdvisorDashboard.css'; // Import the advisor-specific CSS
import AdvisorNavigation from '../Components/AdvisorNavigation'; // Import the AdvisorNavigation component
import CourseTable from '../Components/AdvisorTable'; // Assuming there's a CourseTable component for advisor
import Profile from '../Components/AdvisorProfile'; // Assuming the Profile component is also shared
import 'bootstrap/dist/css/bootstrap.min.css';

const AdvisorDashboard = () => {
    return (
        <div className="AdvisorDashboard container text-center">
            {/* Row 1: Advisor Head */}
            <div className="AdvisorHead row align-items-center mb-5">
                {/* Profile */}
                <div className="col-12 col-md-4"> {/* col-12 for small screens, col-md-4 for medium and up */}
                    <Profile />
                </div>

                {/* Advisor Navigation */}
                <div className="col-12 col-md-8 d-flex justify-content-end"> {/* col-12 for small screens, col-md-8 for medium and up */}
                    <AdvisorNavigation />
                </div>
            </div>
            
            {/* Row 2: Course Title */}
            <div className="AdvisorCoursesTitle row mb-3">
                <div className="col">
                    <h3>Student List</h3> {/* Changed title to "Student List" for advisor context */}
                </div>
            </div>
            
            {/* Row 3: Course Table */}
            <div className="AdvisorCourseList row">
                <div className="col">
                    <CourseTable /> {/* Assuming the advisor sees a table for the students they oversee */}
                </div>
            </div>
        </div>
    );
};

export default AdvisorDashboard;
