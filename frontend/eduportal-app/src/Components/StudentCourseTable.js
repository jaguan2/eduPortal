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
    CircularProgress,
    Alert,
} from '@mui/material';

const CourseTable = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRows = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/StudentCourses');
                setRows(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error || 'Failed to fetch data.');
                } else {
                    setError('An unexpected error occurred!');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRows();
    }, []);

    if (loading) {
        return (
            <Typography align="center" marginY={3}>
                <CircularProgress />
            </Typography>
        );
    }

    if (error) {
        return (
            <Alert severity="error" style={{ marginBottom: '2rem' }}>
                {error}
            </Alert>
        );
    }

    return (
        <TableContainer component={Paper} elevation={3}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Course</strong></TableCell>
                        <TableCell><strong>Semester</strong></TableCell>
                        <TableCell><strong>Year</strong></TableCell>
                        <TableCell><strong>Credits</strong></TableCell>
                        <TableCell><strong>Grade</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((data, index) => (
                        <TableRow key={index}>
                            <TableCell>{data.course}</TableCell>
                            <TableCell>{data.semester}</TableCell>
                            <TableCell>{data.year}</TableCell>
                            <TableCell>{data.credits}</TableCell>
                            <TableCell>{data.grade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CourseTable;
