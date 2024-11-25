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
                </Typography>
                <CourseTable semester={semester} year={year} />
            </Paper>
        </Container>
    );
};

export default InstructorDashboard;
