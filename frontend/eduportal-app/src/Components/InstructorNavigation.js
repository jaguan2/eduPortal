// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios
// import './InstructorNavigation.css';

// const InstructorNavigation = () => {
//     // api call to get data
//     const [UID, setUID] = useState(''); // State for the UID
//     const [department, setDepartment] = useState(''); // State for the GPA
//     const [error, setError] = useState(''); // State for handling errors

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

//         const fetchDepartment = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getDepartment');
//                 console.log(response.data)
//                 setDepartment(response.data);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         fetchDepartment();

//     }, []); // Empty dependency array ensures this runs only once

//     return (
//         <div className="NavigationBox container px-4">
//             <div className="col d-flex">
//                 <div className="Info col">
//                     <div className="InfoLabel item">UID:</div>
//                     <div className="InfoData item">{UID}</div>
//                 </div>
//                 <div className="Info col">
//                     <div className="InfoLabel item">Dept:</div>
//                     <div className="InfoData item">{department}</div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default InstructorNavigation;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Box, Typography, Alert, CircularProgress, Container } from '@mui/material';

const InstructorNavigation = () => {
    // State for instructor-specific data
    const [UID, setUID] = useState(''); // State for the UID
    const [department, setDepartment] = useState(''); // State for the department
    const [error, setError] = useState(''); // State for handling errors

    // Fetch UID and Department
    useEffect(() => {
        const fetchUID = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getID');
                setUID(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.error || 'An unexpected error occurred!'
                );
            }
        };

        const fetchDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getDepartment');
                setDepartment(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.error || 'An unexpected error occurred!'
                );
            }
        };

        fetchUID();
        fetchDepartment();
    }, []);

    return (
        <Container maxWidth="md" style={{ marginTop: '1rem' }}>
            {/* Error Handling */}
            {error && (
                <Alert severity="error" style={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            )}

            {/* UID and Department Display */}
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                border={1}
                borderRadius={2}
                borderColor="grey.300"
            >
                <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                        UID:
                    </Typography>
                    <Typography variant="body1">
                        {UID || <CircularProgress size={20} />}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                        Department:
                    </Typography>
                    <Typography variant="body1">
                        {department || <CircularProgress size={20} />}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default InstructorNavigation;
