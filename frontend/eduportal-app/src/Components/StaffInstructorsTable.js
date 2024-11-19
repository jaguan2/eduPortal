import React from 'react';
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
} from '@mui/material';

const StaffInstructorsTable = ({ instructors }) => {
    // Function to format Instructor ID
    const formatInstructorId = (id) => {
        return id ? `U33${id.toString().padStart(6, '0')}` : 'N/A'; // Pads ID and handles missing values
    };

    return (
        <Box width="100%" marginTop={3}>
            {/* Header */}
            <Typography variant="h5" align="center" gutterBottom>
                Instructors
            </Typography>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Instructor ID</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {instructors.map((instructor) => (
                            <TableRow key={instructor.instructor_id}>
                                <TableCell>{formatInstructorId(instructor.instructor_id)}</TableCell>
                                <TableCell>{instructor.username}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StaffInstructorsTable;
