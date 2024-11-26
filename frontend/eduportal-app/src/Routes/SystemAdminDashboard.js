import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Button,
    ButtonGroup,
    Alert,
    Paper,
    CircularProgress,
} from '@mui/material';
import Profile from '../Components/SystemAdminProfile';
import LogsTable from '../Components/SystemAdminLogsTable';
import SystemAdminGPAStatisticsTable from '../Components/SystemAdminGPAStatisticsTable';
import DepartmentGPATable from '../Components/SystemAdminDepartmentGPATable';
import SystemAdminSemesterCourseStatsTable from '../Components/SystemAdminSemesterCourseStatsTable';
import InstructorStudentsByMajorTable from '../Components/SystemInstructorByStudentsMajorTable';
import ListStudentsByMajorTable from '../Components/SystemAdminStudentsByMajorTable';
import SystemAdminNavigation from '../Components/SystemAdminNavigation';
const SystemAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('logs'); // Track active page
    const [error, setError] = useState('');
    const [UID, setUID] = useState('U550000001');
    const [department, setDepartment] = useState('Admin');

    const handleLogout = () => {
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <Container style={{ marginTop: '2rem' }}>
            {/* Header Section: Profile, UID, Department, and Logout */}
            <Grid container spacing={2} alignItems="center" marginBottom={4}>
                <Grid item xs={12} md={4}>
                    <Profile />
                </Grid>
                <Grid item xs={6} md={4}>
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
                <Grid item xs={6} md={4} textAlign="end">
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        Log Out
                    </Button>
                </Grid>
            </Grid>

            {/* Navigation Buttons */}
            <Box textAlign="center" marginBottom={4}>
                <ButtonGroup variant="outlined" color="primary">
                    <Button
                        variant={activeTab === 'logs' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('logs')}
                    >
                        Logs
                    </Button>
                    <Button
                        variant={activeTab === 'gpa' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('gpa')}
                    >
                        Major GPA Rankings
                    </Button>
                    <Button
                        variant={activeTab === 'department_gpa' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('department_gpa')}
                    >
                        Department GPA Rankings
                    </Button>
                    <Button
                        variant={activeTab === 'course_stats' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('course_stats')}
                    >
                        Semester Course Statistics
                    </Button>
                    <Button
                        variant={activeTab === 'instructor_students' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('instructor_students')}
                    >
                        Instructor Students by Major
                    </Button>
                    <Button
                        variant={activeTab === 'students_by_major' ? 'contained' : 'outlined'}
                        onClick={() => setActiveTab('students_by_major')}
                    >
                        Students by Major
                    </Button>
                </ButtonGroup>
            </Box>

            {/* Content Section */}
            <Paper elevation={3} style={{ padding: '2rem' }}>
                {activeTab === 'logs' && <LogsTable />}
                {activeTab === 'gpa' && <SystemAdminGPAStatisticsTable />}
                {activeTab === 'department_gpa' && <DepartmentGPATable />}
                {activeTab === 'course_stats' && <SystemAdminSemesterCourseStatsTable />}
                {activeTab === 'instructor_students' && <InstructorStudentsByMajorTable />}
                {activeTab === 'students_by_major' && <ListStudentsByMajorTable />}
            </Paper>
        </Container>
    );
};

export default SystemAdminDashboard;
