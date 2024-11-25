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

const StaffCoursesTable = ({ courses }) => {
    // Function to format Instructor ID
    const formatInstructorId = (id) => {
        return id ? `U33${id.toString().padStart(6, '0')}` : 'N/A'; // Pads ID and handles missing values
    };

    return (
        <Box marginTop={3} width="100%">
            {/* Header */}
            <Typography variant="h5" align="center" gutterBottom>
                Courses
            </Typography>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Course ID</strong></TableCell>
                            <TableCell><strong>Prefix</strong></TableCell>
                            <TableCell><strong>Number</strong></TableCell>
                            <TableCell><strong>Course Name</strong></TableCell>
                            <TableCell><strong>Credits</strong></TableCell>
                            <TableCell><strong>Semester</strong></TableCell>
                            <TableCell><strong>Year</strong></TableCell>
                            <TableCell><strong>Class Time</strong></TableCell>
                            <TableCell><strong>Class Day</strong></TableCell>
                            <TableCell><strong>Instructor ID</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.id}</TableCell>
                                <TableCell>{course.prefix}</TableCell>
                                <TableCell>{course.number}</TableCell>
                                <TableCell>{course.courseName}</TableCell>
                                <TableCell>{course.credits}</TableCell>
                                <TableCell>{course.semester}</TableCell>
                                <TableCell>{course.year}</TableCell>
                                <TableCell>{course.classTime}</TableCell>
                                <TableCell>{course.classDay}</TableCell>
                                <TableCell>{formatInstructorId(course.instructor)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StaffCoursesTable;
