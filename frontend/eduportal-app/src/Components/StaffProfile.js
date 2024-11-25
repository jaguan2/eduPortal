// import React, { useState, useEffect } from 'react';
// import UserProfilePicture from '../Images/UserProfilePicture.png';
// import axios from 'axios'; // Import Axios
// import './Profile.css';

// // this component represents the area displaying the user's Icon and Name
// const StaffProfile = () => {
//     // API call to get data
//     const [name, setName] = useState(''); // State for the name
//     const [error, setError] = useState(''); // State for handling errors

//     // Use an API call to fetch the user's name
//     useEffect(() => {
//         const fetchName = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getStaffName');
//                 console.log(response.data);
//                 setName(response.data.username); // Access 'username' from the JSON response
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error || 'Failed to fetch name.');
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         fetchName();
//     }, []); // Empty dependency array ensures this runs only once

//     return (
//         <div className="ProfileContainer container">
//             <div className="col Profile d-flex align-items-center">
//                 <div className="ProfileImage col-4">
//                     <img className="img-fluid" src={UserProfilePicture} alt="Profile" />
//                 </div>
//                 <div className="UserName col-3 d-flex align-items-center">
//                     {error ? (
//                         <div style={{ color: 'red' }}>
//                             {error} {/* Show error if there's an issue */}
//                         </div>
//                     ) : (
//                         <h2 className="Name">{name || 'Loading...'}</h2> // Show loading text if name is not yet fetched
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StaffProfile;

import React, { useState, useEffect } from 'react';
import UserProfilePicture from '../Images/UserProfilePicture.png';
import axios from 'axios';
import {
    Container,
    Box,
    Avatar,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';

const StaffProfile = () => {
    const [name, setName] = useState(''); // State for the name
    const [error, setError] = useState(''); // State for handling errors

    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getStaffName');
                setName(response.data.username); // Access 'username' from the JSON response
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error || 'Failed to fetch name.');
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchName();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                gap={2}
            >
                {/* Profile Picture */}
                <Avatar
                    src={UserProfilePicture}
                    alt="Profile"
                    sx={{ width: 120, height: 120 }}
                />

                {/* Error or Name */}
                {error ? (
                    <Alert severity="error" style={{ textAlign: 'center' }}>
                        {error}
                    </Alert>
                ) : (
                    <Typography variant="h5" align="center">
                        {name || (
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={20} />
                                Loading...
                            </Box>
                        )}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default StaffProfile;
