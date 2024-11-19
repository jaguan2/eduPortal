// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Import Axios
// import './SystemAdminNavigation.css';

// const SystemAdminNavigation = () => {
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
//                 {/* <div className="Info col">
//                     <div className="InfoLabel item">Dept:</div>
//                     <div className="InfoData item">{department}</div>
//                 </div> */}
//             </div>
//         </div>
//     )
// }

// export default SystemAdminNavigation;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Container,
} from '@mui/material';

const SystemAdminNavigation = () => {
    const [UID, setUID] = useState(''); // State for the UID
    const [department, setDepartment] = useState(''); // State for the department
    const [error, setError] = useState(''); // State for handling errors

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

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                padding={2}
                border={1}
                borderRadius={2}
                borderColor="grey.300"
            >
                {/* Error Alert */}
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}

                {/* UID Section */}
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" color="textSecondary">
                        UID:
                    </Typography>
                    <Typography variant="body1">
                        {UID || <CircularProgress size={20} />}
                    </Typography>
                </Box>

                {/* Department Section */}
                <Box display="flex" justifyContent="space-between">
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

export default SystemAdminNavigation;
