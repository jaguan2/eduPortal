// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios
// import './StudentNavigation.css';
// import {Link, useNavigate} from 'react-router-dom';

// const StudentNavigation = () => {
//     // api call to get data
//     const [UID, setUID] = useState(''); // State for the UID
//     const [GPA, setGPA] = useState(''); // State for the GPA
//     const [error, setError] = useState(''); // State for handling errors
//     const navigate = useNavigate();

//     // Use an API call to fetch the user's uid and gpa
//     useEffect(() => {
//         // Simulating an API call
//         const fetchUID = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getID');
//                 console.log(response.data)
//                 setUID(response.data);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         fetchUID();

//         const fetchGPA = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getGPA');
//                 console.log(response.data)
//                 setGPA(response.data);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         fetchGPA();

//     }, []); // Empty dependency array ensures this runs only once

//     const handleClick = () => {
//         navigate("/WhatIfPage")
//     }

//     return (
//         <div className="NavigationBox container px-4">
//             <div className="col d-flex">
//                 <div className="Info col">
//                     <div className="InfoLabel item">UID:</div>
//                     <div className="InfoData item">{UID}</div>
//                 </div>
//                 <div className="Info col">
//                     <div className="InfoLabel item">GPA:</div>
//                     <div className="InfoData item">{GPA}</div>
//                 </div>
//                 <button type="button" className="col btn btn-primary custom-sizing" onClick={handleClick}>
//                     What if?
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default StudentNavigation;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios
// import './StudentNavigation.css';
// import { useNavigate } from 'react-router-dom';
// import { CircularProgress, Typography, Button, Grid, Paper } from '@mui/material';

// const StudentNavigation = () => {
//     const [UID, setUID] = useState(''); // State for the UID
//     const [GPA, setGPA] = useState(''); // State for the GPA
//     const [courses, setCourses] = useState([]); // State for the courses
//     const [error, setError] = useState(''); // State for handling errors
//     const navigate = useNavigate();

//     // Fetch UID, GPA, and Courses from API
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetching UID
//                 const uidResponse = await axios.get('http://127.0.0.1:5000/getID');
//                 setUID(uidResponse.data);

//                 // Fetching GPA
//                 const gpaResponse = await axios.get('http://127.0.0.1:5000/getGPA');
//                 setGPA(gpaResponse.data);

//                 // Fetching Courses
//                 const coursesResponse = await axios.get('http://127.0.0.1:5000/getStudentCourses');
//                 setCourses(coursesResponse.data.courses);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         fetchData();
//     }, []); // Empty dependency array ensures this runs only once

//     const handleWhatIf = () => {
//         navigate("/WhatIfPage");
//     };

//     const handleLogout = () => {
//         window.location.href = '/'; // Redirect to login page
//     };

//     // Function to pad UID if needed
//     const paddedUID = String(UID).padStart(8, '0');

//     return (
//         <div className="NavigationBox container px-4">
//             <Paper elevation={3} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
//                 <Grid container spacing={2} alignItems="center">
//                     {/* UID */}
//                     <Grid item xs={12} md={4}>
//                         <Typography variant="body1" align="center">
//                             <strong>UID:</strong> {paddedUID || <CircularProgress size={20} />}
//                         </Typography>
//                     </Grid>

//                     {/* GPA */}
//                     <Grid item xs={12} md={4}>
//                         <Typography variant="body1" align="center">
//                             <strong>GPA:</strong> {GPA || <CircularProgress size={20} />}
//                         </Typography>
//                     </Grid>

//                     {/* What-If Button */}
//                     <Grid item xs={12} md={2}>
//                         <Button 
//                             variant="contained" 
//                             color="primary" 
//                             fullWidth 
//                             onClick={handleWhatIf}
//                         >
//                             What-If
//                         </Button>
//                     </Grid>

//                     {/* Log Out Button */}
//                     <Grid item xs={12} md={2}>
//                         <Button 
//                             variant="contained" 
//                             color="error" 
//                             fullWidth 
//                             onClick={handleLogout}
//                         >
//                             Log Out
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Paper>

//             {/* Error Handling */}
//             {error && (
//                 <Paper elevation={3} style={{ padding: '1rem', marginBottom: '2rem' }}>
//                     <Typography variant="body1" color="error" align="center">
//                         <strong>Error: </strong>{error}
//                     </Typography>
//                 </Paper>
//             )}

//             {/* Course List Section */}
//             <Paper elevation={3} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
//                 <Typography variant="h5" align="center" gutterBottom>
//                     Course List
//                 </Typography>
//                 <Grid container spacing={2}>
//                     {courses.length === 0 ? (
//                         <Grid item xs={12}>
//                             <Typography variant="body1" align="center">No courses available.</Typography>
//                         </Grid>
//                     ) : (
//                         courses.map((course, index) => (
//                             <Grid item xs={12} sm={6} md={4} key={index}>
//                                 <Paper elevation={2} style={{ padding: '1rem' }}>
//                                     <Typography variant="body1" align="center">
//                                         {course.name} - {course.code}
//                                     </Typography>
//                                 </Paper>
//                             </Grid>
//                         ))
//                     )}
//                 </Grid>
//             </Paper>
//         </div>
//     );
// };

// export default StudentNavigation;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Grid, Typography, Button, CircularProgress, Alert, Paper } from '@mui/material';

// const StudentNavigation = () => {
//     const [UID, setUID] = useState('');
//     const [GPA, setGPA] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUID = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getID');
//                 setUID(`U${response.data?.padStart(8, '0')}`);
//             } catch (err) {
//                 setError(err.response?.data?.error || 'Failed to fetch UID.');
//             }
//         };

//         const fetchGPA = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getGPA');
//                 setGPA(response.data || 'N/A');
//             } catch (err) {
//                 setError(err.response?.data?.error || 'Failed to fetch GPA.');
//             }
//         };

//         fetchUID();
//         fetchGPA();
//     }, []);

//     const handleWhatIf = () => {
//         navigate('/WhatIfPage');
//     };

//     const handleLogout = () => {
//         window.location.href = '/'; // Redirect to login page
//     };

//     return (
//         <Paper elevation={3} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
//             <Grid container spacing={2} alignItems="center">
//                 {/* UID Display */}
//                 <Grid item xs={12} sm={4}>
//                     <Typography variant="body1" align="center">
//                         <strong>UID:</strong> {UID || <CircularProgress size={20} />}
//                     </Typography>
//                 </Grid>

//                 {/* GPA Display */}
//                 <Grid item xs={12} sm={4}>
//                     <Typography variant="body1" align="center">
//                         <strong>GPA:</strong> {GPA || <CircularProgress size={20} />}
//                     </Typography>
//                 </Grid>

//                 {/* What-If Button */}
//                 <Grid item xs={12} sm={2}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         onClick={handleWhatIf}
//                     >
//                         What-If
//                     </Button>
//                 </Grid>

//                 {/* Logout Button */}
//                 <Grid item xs={12} sm={2}>
//                     <Button
//                         variant="contained"
//                         color="error"
//                         fullWidth
//                         onClick={handleLogout}
//                     >
//                         Log Out
//                     </Button>
//                 </Grid>
//             </Grid>

//             {/* Error Display */}
//             {error && (
//                 <Alert severity="error" style={{ marginTop: '1rem' }}>
//                     {error}
//                 </Alert>
//             )}
//         </Paper>
//     );
// };

// export default StudentNavigation;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, Alert, Paper } from '@mui/material';

const StudentNavigation = () => {
    const [GPA, setGPA] = useState('Loading...'); // State for GPA
    const [error, setError] = useState(''); // State for errors
    const navigate = useNavigate();

    // Hardcoded UID
    const UID = 'U11000001';

    useEffect(() => {
        // Simulate GPA fetch
        const fetchGPA = async () => {
            try {
                // Simulating an API call
                const response = { data: '3.75' }; // Mock data
                setGPA(response.data);
            } catch (err) {
                setError('Failed to fetch GPA.');
            }
        };

        fetchGPA();
    }, []);

    const handleWhatIf = () => {
        navigate('/WhatIfPage');
    };

    const handleLogout = () => {
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <Paper elevation={3} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <Grid container spacing={2} alignItems="center">
                {/* UID Display */}
                <Grid item xs={12} md={4}>
                    <Typography variant="body1" align="center">
                        <strong>UID:</strong> {UID}
                    </Typography>
                </Grid>

                {/* GPA Display */}
                <Grid item xs={12} md={4}>
                    <Typography variant="body1" align="center">
                        <strong>GPA:</strong> {GPA}
                    </Typography>
                </Grid>

                {/* What-If Button */}
                <Grid item xs={12} md={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleWhatIf}
                    >
                        What-If
                    </Button>
                </Grid>

                {/* Logout Button */}
                <Grid item xs={12} md={2}>
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

            {/* Error Handling */}
            {error && (
                <Alert severity="error" style={{ marginTop: '1rem' }}>
                    {error}
                </Alert>
            )}
        </Paper>
    );
};

export default StudentNavigation;
