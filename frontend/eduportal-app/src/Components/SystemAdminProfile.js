import React, { useState, useEffect } from 'react';
import UserProfilePicture from '../Images/UserProfilePicture.png';
import axios from 'axios';
import { Container, Box, Typography, CircularProgress, Avatar, Alert } from '@mui/material';

const Profile = () => {
    const [name, setName] = useState(''); // State for the name
    const [error, setError] = useState(''); // State for handling errors

    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getAdminName');
                setName(response.data.username); // Set only the "username" field
            } catch (error) {
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    setError(error.response.data.error);
                } else {
                    console.error('Error:', error.message);
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
                justifyContent="center"
                flexDirection="column"
                gap={2}
            >
                {/* Profile Picture */}
                <Avatar
                    src={UserProfilePicture}
                    alt="Profile"
                    sx={{ width: 120, height: 120 }}
                />

                {/* Name or Loading/Error */}
                {error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Typography variant="h5" component="h2">
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

export default Profile;
