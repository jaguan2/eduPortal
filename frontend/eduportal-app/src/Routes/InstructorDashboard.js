// import React, { useState, useEffect } from 'react';
// import './InstructorDashboard.css';
// import InstructorNavigation from '../Components/InstructorNavigation';
// import CourseTable from '../Components/InstructorCourseTable';
// import Profile from '../Components/InstructorProfile';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const InstructorDashboard = () => {
//     const [semester, setSemester] = useState(''); // State for semester input
//     const [year, setYear] = useState(''); // State for year input
//     const [selectedCourses, setSelectedCourses] = useState([]); // State to store selected courses
//     const [students, setStudents] = useState([]);

//     // Handle input changes
//     const handleSemesterChange = (e) => setSemester(e.target.value);
//     const handleYearChange = (e) => setYear(e.target.value);

//     // Handle course selection
//     const handleSelectCourses = (courseId) => {
//         setSelectedCourses((prev) =>
//             prev.includes(courseId)
//                 ? prev.filter((id) => id !== courseId) // Unselect course if already selected
//                 : [...prev, courseId] // Select course
//         );
//     };

//     // Handle submit to show students in selected courses
//     const handleSubmit = async () => {
//         try {
//             // Assuming you have an API endpoint to fetch students for selected courses
//             const response = await fetch(`http://127.0.0.1:5000/getStudents`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ courseIds: selectedCourses }), // Send selected course IDs
//             });

//             const data = await response.json();
//             setStudents(data); // Store students data in state
//         } catch (error) {
//             console.error('Error fetching students:', error);
//         }
//     };

//     return (
//         <div className="InstructorDashboard d-flex align-items-center text-center">
//             <div className="container text-center">
//                 {/* Row 1: Instructor Head */}
//                 <div className="InstructorHead row align-items-center mb-5">
//                     {/* Profile */}
//                     <div className="col">
//                         <Profile />
//                     </div>

//                     {/* Instructor Navigation */}
//                     <div className="col d-flex justify-content-end">
//                         <InstructorNavigation />
//                     </div>
//                 </div>
                
//                 {/* Row 2: Course Title */}
//                 <div className="InstructorCoursesTitle row mb-3">
//                     <div className="col">
//                         <h3>Course List</h3>
//                     </div>
//                 </div>

//                 {/* Row 3: Filter Options */}
//                 <div className="row mb-3 d-flex align-items-center">
//                     {/* Semester Input */}
//                     <div className="Filter col-12 col-md-4 d-flex align-items-center">
//                         <h3 className="me-2">Semester</h3>
//                         <input
//                             type="text"
//                             className="form-control"
//                             value={semester}
//                             onChange={handleSemesterChange}
//                         />
//                     </div>

//                     {/* Year Input */}
//                     <div className="Filter col-12 col-md-4 d-flex align-items-center">
//                         <h3 className="me-2">Year</h3>
//                         <input
//                             type="text"
//                             className="form-control"
//                             value={year}
//                             onChange={handleYearChange}
//                         />
//                     </div>
//                 </div>

//                 {/* Row 4: Course Table */}
//                 <div className="InstructorCourseList row">
//                     <div className="col">
//                         {/* Pass semester and year to CourseTable */}
//                         <CourseTable semester={semester} year={year}/>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InstructorDashboard;

import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Grid,
    Typography,
    Button,
    TextField,
    Box,
} from '@mui/material';
import Profile from '../Components/InstructorProfile';
import InstructorNavigation from '../Components/InstructorNavigation';
import CourseTable from '../Components/InstructorCourseTable';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');
    const navigate = useNavigate();

    const UID = 'U33000001'; // Hardcoded UID for demonstration
    const department = 'Computer Science'; // Hardcoded Department for demonstration

    const handleLogout = () => {
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            {/* Unified Profile and Navigation Section */}
            <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
                <Grid container spacing={3} alignItems="center">
                    {/* Profile */}
                    <Grid item xs={12} md={3}>
                        <Profile />
                    </Grid>

                    {/* UID and Department */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    <strong>UID:</strong> {UID}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    <strong>Department:</strong> {department}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12} md={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Filter Section */}
            <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6">Semester:</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                placeholder="Enter semester"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6">Year:</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="Enter year"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Course List Section */}
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Course List
                </Typography>
                <CourseTable semester={semester} year={year} />
            </Paper>
        </Container>
    );
};

export default InstructorDashboard;
