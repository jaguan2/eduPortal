import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Alert,
    Box,
    Grid,
    CircularProgress,
} from '@mui/material';
import StaffCoursesTable from './StaffCoursesTable'; // Import courses table
import StaffInstructorsTable from './StaffInstructorsTable'; // Import instructors table

const AssignInstructorsPage = () => {
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch courses and instructors on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesResponse = await axios.get('http://127.0.0.1:5000/getStaffCourses', {
                    params: { department_id: 1 }, // Example department ID
                });
                const instructorsResponse = await axios.get('http://127.0.0.1:5000/getStaffInstructors', {
                    params: { department_id: 1 },
                });

                // Update instructors with padded IDs
                const updatedInstructors = instructorsResponse.data.map((instructor) => ({
                    ...instructor,
                    instructor_id: `U33${instructor.instructor_id.toString().padStart(6, '0')}`,
                }));

                setCourses(coursesResponse.data);
                setInstructors(updatedInstructors);
            } catch (error) {
                setError('Failed to fetch data.');
            }
        };

        fetchData();
    }, []);

    const handleAssignInstructor = async () => {
        if (!courseId || !instructorId) {
            setError('Course ID and Instructor ID are required.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/assign_instructors', {
                course_id: courseId,
                instructor_id: instructorId.replace('U33', ''), // Remove padding before sending
                department_id: 1, // Replace with dynamic department ID
                user_id: 1,       // Replace with dynamic user ID
                username: 'staff_user',
            });
            setSuccess(response.data.message);
            setCourseId('');
            setInstructorId('');
        } catch (error) {
            setError('Failed to assign instructor. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={{ marginTop: '2rem' }}>
            {/* Header */}
            <Typography variant="h4" align="center" gutterBottom>
                Assign Instructors
            </Typography>

            {/* Error and Success Alerts */}
            {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
            {success && <Alert severity="success" style={{ marginBottom: '1rem' }}>{success}</Alert>}

            {/* Form Section */}
            <Paper style={{ padding: '2rem', marginBottom: '2rem' }}>
                <Typography variant="h6" gutterBottom>
                    Assign Instructor
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Course ID"
                            placeholder="Enter course ID"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Instructor ID"
                            placeholder="Enter instructor ID"
                            value={instructorId}
                            onChange={(e) => setInstructorId(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Box marginTop={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleAssignInstructor}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Assign Instructor'}
                    </Button>
                </Box>
            </Paper>

            {/* Tables Section */}
            <Grid container spacing={3}>
                {/* Courses Table */}
                <Grid item xs={12}>
                    <StaffCoursesTable courses={courses} />
                </Grid>

                {/* Instructors Table */}
                <Grid item xs={12} sm={6}>
                    <StaffInstructorsTable instructors={instructors} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default AssignInstructorsPage;
