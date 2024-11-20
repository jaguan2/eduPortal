// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdvisorNavigation.css';

// const AdvisorNavigation = () => {
//     // State for advisor-specific info
//     const [UID, setUID] = useState(''); // State for the UID
//     const [department, setDepartment] = useState(''); // State for the department
//     const [error, setError] = useState(''); // State for handling errors

//     // Use an API call to fetch the advisor's UID, department, and office
//     useEffect(() => {
//         const fetchUID = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getID');
//                 console.log(response.data);
//                 setUID(response.data);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         // Call the fetchUID function
//         fetchUID();
//     }, []); // Empty dependency array ensures this runs only once


//     const fetchDepartment = async () => {
//         try {
//             const response = await axios.get('http://127.0.0.1:5000/getDepartment');
//             console.log(response.data)
//             setDepartment(response.data);
//         } catch (error) {
//             if (error.response) {
//                 setError(error.response.data.error);
//             } else {
//                 setError('An unexpected error occurred!');
//             }
//         }
//     };

//     fetchDepartment();

//     return (
//         <div className="NavigationBox container px-4">
//             <div className="row">
//                 <div className="Info col">
//                     <div className="InfoLabel item">UID:</div>
//                     <div className="InfoData item">{UID || 'Loading...'}</div>
//                 </div>
//                 <div className="Info col">
//                     <div className="InfoLabel item">Department:</div>
//                     <div className="InfoData item">{department || 'Loading...'}</div>
//                 </div>
//                 {error && <div className="error-message">{error}</div>}
//             </div>
//         </div>
//     );
// };

// export default AdvisorNavigation;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Box,
    Grid,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdvisorNavigation = () => {
    const [UID, setUID] = useState(''); // State for the UID
    const [department, setDepartment] = useState(''); // State for the department
    const [error, setError] = useState(''); // State for handling errors
    const navigate = useNavigate();

    // Fetch UID and Department
    useEffect(() => {
        const fetchUID = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getID');
                setUID(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        const fetchDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getDepartment');
                setDepartment(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchUID();
        fetchDepartment();
    }, []);

    // Handlers for navigation
    const handleWhatIf = () => {
        navigate('/WhatIfPage');
    };

    const handleLogout = () => {
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            {/* Error Handling */}
            {error && (
                <Alert severity="error" style={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            )}

            {/* Navigation Section */}
            <Paper elevation={3} style={{ padding: '2rem', marginBottom: '2rem' }}>
                <Grid container spacing={3} alignItems="center">
                    {/* UID and Department */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="subtitle1" color="textSecondary">
                                UID:
                            </Typography>
                            <Typography variant="body1">
                                {UID || <CircularProgress size={20} />}
                            </Typography>
                        </Box>
                        <Box marginTop={2}>
                            <Typography variant="subtitle1" color="textSecondary">
                                Department:
                            </Typography>
                            <Typography variant="body1">
                                {department || <CircularProgress size={20} />}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleWhatIf}
                            >
                                What If
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                            >
                                Log Out
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default AdvisorNavigation;
