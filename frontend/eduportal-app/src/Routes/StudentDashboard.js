import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Grid, Typography, Button } from '@mui/material';
import Profile from '../Components/Profile';
import CourseTable from '../Components/StudentCourseTable';

const StudentDashboard = () => {
    const UID = 'U11000001'; // Hardcoded UID
    const GPA = '3.75'; // Hardcoded GPA for demonstration
    const navigate = useNavigate(); // React Router hook for navigation

    const handleWhatIf = () => {
        navigate('/WhatIfPage'); // Navigate to the What-If page
    };

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

                    {/* UID and GPA */}
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    <strong>UID:</strong> {UID}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    <strong>GPA:</strong> {GPA}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Buttons */}
                    <Grid item xs={12} md={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleWhatIf}
                                >
                                    What-If
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
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

            {/* Course List Section */}
            <Paper elevation={3} style={{ padding: '2rem' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Course List
                </Typography>
                <CourseTable />
            </Paper>
        </Container>
    );
};

export default StudentDashboard;
