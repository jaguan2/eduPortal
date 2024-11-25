import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Alert,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from '@mui/material';

const StaffManageInstructorsTable = () => {
    const [instructors, setInstructors] = useState([]); // State to store instructor data
    const [error, setError] = useState(''); // State for error handling
    const [showPasswords, setShowPasswords] = useState(false); // State to toggle password visibility

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                // Fetch data from the backend route
                const response = await axios.get('http://127.0.0.1:5000/getStaffManageInstructors');
                // Pad instructor IDs
                const paddedInstructors = response.data.map((instructor) => ({
                    ...instructor,
                    instructor_id: `U33${instructor.instructor_id.toString().padStart(6, '0')}`,
                }));
                setInstructors(paddedInstructors); // Update state with padded data
            } catch (err) {
                setError('Failed to fetch instructors.'); // Handle errors
            }
        };

        fetchInstructors(); // Trigger fetch when the component mounts
    }, []);

    return (
        <Container style={{ marginTop: '2rem' }}>
            {/* Header */}
            <Typography variant="h4" align="center" gutterBottom>
                Instructors
            </Typography>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" style={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            )}

            {/* Toggle Button */}
            <Box textAlign="end" marginBottom={2}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowPasswords((prev) => !prev)}
                >
                    {showPasswords ? 'Hide Passwords' : 'Show Passwords'}
                </Button>
            </Box>

            {/* Instructors Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Instructor ID</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Password</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {instructors.map((instructor) => (
                            <TableRow key={instructor.instructor_id}>
                                <TableCell>{instructor.instructor_id}</TableCell>
                                <TableCell>{instructor.username}</TableCell>
                                <TableCell>{showPasswords ? instructor.password : '******'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default StaffManageInstructorsTable;
