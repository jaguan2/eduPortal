import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Button,
    Alert,
} from '@mui/material';

const StaffAdvisorsTable = () => {
    const [advisors, setAdvisors] = useState([]); // State to store advisor data
    const [error, setError] = useState(''); // State for error handling
    const [showPasswords, setShowPasswords] = useState(false); // Toggle passwords visibility

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                // Fetch data from backend
                const response = await axios.get('http://127.0.0.1:5000/getStaffAdvisors');
                // Pad advisor IDs
                const paddedAdvisors = response.data.map((advisor) => ({
                    ...advisor,
                    id: `U22${advisor.id.toString().padStart(6, '0')}`,
                }));
                setAdvisors(paddedAdvisors); // Set padded data
            } catch (err) {
                setError('Failed to fetch advisors.');
            }
        };

        fetchAdvisors(); // Trigger fetch when component mounts
    }, []);

    return (
        <Box marginTop={3}>
            {/* Header */}
            <Typography variant="h5" align="center" gutterBottom>
                Advisors in Your Department
            </Typography>

            {/* Error Alert */}
            {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}

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

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Advisor ID</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Password</strong></TableCell>
                            <TableCell><strong>Department ID</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {advisors.map((advisor) => (
                            <TableRow key={advisor.id}>
                                <TableCell>{advisor.id}</TableCell>
                                <TableCell>{advisor.username}</TableCell>
                                <TableCell>{showPasswords ? advisor.password : '******'}</TableCell>
                                <TableCell>{advisor.department}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StaffAdvisorsTable;
