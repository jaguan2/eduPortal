import React, { useState, useEffect } from 'react';
import StaffProfile from '../Components/StaffProfile';
import StaffNavigation from '../Components/StaffNavigation';
import DepartmentCheck from '../Components/StaffDepartmentCheck'; // Check authorization
import axios from 'axios';
import {
    Container,
    Box,
    Paper,
    Button,
    Grid,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';

const StaffDashboard = () => {
    const [UID, setUID] = useState('Loading...');
    const [department, setDepartment] = useState('Loading...');
    const [error, setError] = useState('');

    const userId = 1; // Hardcoded user ID
    const departmentId = 1; // Hardcoded department ID

    // Fetch UID and Department
    useEffect(() => {
        const fetchUID = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getStaffID');
                console.log('UID Response:', response.data); // Debugging
                const rawUID = response.data?.uid || ''; // Safely access `uid`
                const paddedUID = `U44${rawUID.toString().padStart(6, '0')}`;
                setUID(paddedUID);
            } catch (error) {
                console.error('UID Fetch Error:', error.response || error.message); // Debugging
                setError(error.response?.data?.error || 'An unexpected error occurred!');
            }
        };

        const fetchDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getStaffDepartment');
                console.log('Department Response:', response.data); // Debugging
                const deptName = response.data?.departmentName || 'Computer Science'; // Fallback value
                setDepartment(deptName);
            } catch (error) {
                console.error('Department Fetch Error:', error.response || error.message); // Debugging
                setError(error.response?.data?.error || 'An unexpected error occurred!');
            }
        };

        fetchUID();
        fetchDepartment();
    }, []);

    // Logout function
    const handleLogout = () => {
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <Container style={{ marginTop: '2rem' }}>
            {/* Profile Section */}
            <Paper elevation={3} style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Profile */}
                    <Grid item xs={12} md={4}>
                        <StaffProfile />
                    </Grid>

                    {/* UID and Department Information */}
                    <Grid item xs={12} md={6}>
                        {error ? (
                            <Alert severity="error">{error}</Alert>
                        ) : (
                            <Box>
                                <Typography variant="subtitle1" color="textSecondary">
                                    UID:
                                </Typography>
                                <Typography variant="body1">
                                    {UID || <CircularProgress size={20} />}
                                </Typography>
                                <Box marginTop={2}>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Department:
                                    </Typography>
                                    <Typography variant="body1">
                                        {department || <CircularProgress size={20} />}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Grid>

                    {/* Logout Button */}
                    <Grid item xs={12} md={2} textAlign="end">
                        <Button variant="contained" color="error" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Navigation Section */}
            <Box marginBottom={4}>
                <Paper elevation={3} style={{ padding: '1.5rem' }}>
                    <StaffNavigation />
                </Paper>
            </Box>

            {/* Department Authorization Section */}
            <Box marginBottom={4}>
                <Paper elevation={3} style={{ padding: '1.5rem' }}>
                    <DepartmentCheck userId={userId} departmentId={departmentId} />
                </Paper>
            </Box>
        </Container>
    );
};

export default StaffDashboard;
