// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//     Box,
//     Typography,
//     Alert,
//     CircularProgress,
//     Container,
// } from '@mui/material';

// const SystemAdminNavigation = () => {
//     const [UID, setUID] = useState(''); // State for the UID
//     const [department, setDepartment] = useState(''); // State for the department
//     const [error, setError] = useState(''); // State for handling errors

//     useEffect(() => {
//         const fetchUID = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getID');
//                 setUID(response.data);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         const fetchDepartment = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getDepartment');
//                 setDepartment(response.data);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         fetchUID();
//         fetchDepartment();
//     }, []);

//     return (
//         <Container maxWidth="md" style={{ marginTop: '2rem' }}>
//             <Box
//                 display="flex"
//                 flexDirection="column"
//                 gap={2}
//                 padding={2}
//                 border={1}
//                 borderRadius={2}
//                 borderColor="grey.300"
//             >
//                 {/* Error Alert */}
//                 {error && (
//                     <Alert severity="error">{error}</Alert>
//                 )}

//                 {/* UID Section */}
//                 <Box display="flex" justifyContent="space-between">
//                     <Typography variant="subtitle1" color="textSecondary">
//                         UID:
//                     </Typography>
//                     <Typography variant="body1">
//                         {UID || <CircularProgress size={20} />}
//                     </Typography>
//                 </Box>

//                 {/* Department Section */}
//                 <Box display="flex" justifyContent="space-between">
//                     <Typography variant="subtitle1" color="textSecondary">
//                         Department:
//                     </Typography>
//                     <Typography variant="body1">
//                         {department || <CircularProgress size={20} />}
//                     </Typography>
//                 </Box>
//             </Box>
//         </Container>
//     );
// };

// export default SystemAdminNavigation;
import React from 'react';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Container,
} from '@mui/material';

const SystemAdminNavigation = () => {
    // Hardcoded values
    const UID = 'U550000123'; // Hardcoded UID with formatting
    const department = 'Admin'; // Hardcoded department

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
                {/* Hardcoded error example can be removed if not needed */}
                {/* Uncomment to show error:
                <Alert severity="error">An error occurred</Alert>
                */}

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
