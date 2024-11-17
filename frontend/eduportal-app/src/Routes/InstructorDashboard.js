import React, { useState, useEffect } from 'react';
import './InstructorDashboard.css';
import InstructorNavigation from '../Components/InstructorNavigation';
import CourseTable from '../Components/InstructorCourseTable';
import Profile from '../Components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

const InstructorDashboard = () => {
    const [semester, setSemester] = useState(''); // State for semester input
    const [year, setYear] = useState(''); // State for year input

    // Handle input changes
    const handleSemesterChange = (e) => setSemester(e.target.value);
    const handleYearChange = (e) => setYear(e.target.value);

    return (
        <div className="InstructorDashboard container text-center">
            {/* Row 1: Instructor Head */}
            <div className="InstructorHead row align-items-center mb-5">
                {/* Profile */}
                <div className="col-12 col-md-4"> {/* col-12 for small screens, col-md-4 for medium and up */}
                    <Profile />
                </div>

                {/* Instructor Navigation */}
                <div className="col-12 col-md-8 d-flex justify-content-end"> {/* col-12 for small screens, col-md-8 for medium and up */}
                    <InstructorNavigation />
                </div>
            </div>
            
            {/* Row 2: Course Title */}
            <div className="InstructorCoursesTitle row mb-3">
                <div className="col">
                    <h3>Course List</h3>
                </div>
            </div>

            {/* Row 3: Filter Options */}
            <div className="row mb-3 d-flex flex-nowrap align-items-center">
                {/* Semester Input */}
                <div className="Filter col-12 col-md-4 d-flex align-items-center">
                    <h3 className="me-2">Semester</h3>
                    <input
                        type="text"
                        className="form-control"
                        value={semester}
                        onChange={handleSemesterChange}
                    />
                </div>

                {/* Year Input */}
                <div className="Filter col-12 col-md-4 d-flex align-items-center">
                    <h3 className="me-2">Year</h3>
                    <input
                        type="text"
                        className="form-control"
                        value={year}
                        onChange={handleYearChange}
                    />
                </div>

                {/* Search Button */}
                <div className="Filter col-12 col-md-4 d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary custom-sizing SearchButton w-50">
                        Search
                    </button>
                </div>
            </div>

            {/* Row 4: Course Table */}
            <div className="InstructorCourseList row">
                <div className="col">
                    <CourseTable semester={semester} year={year}/>
                </div>
            </div>

            {/* Row 5: Submit Button */}
            <div className="row SubmitButton">
                <button type="submit" className="col btn btn-primary custom-sizing">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default InstructorDashboard;