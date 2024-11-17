import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import axios from 'axios'; // Import Axios

const CourseTable = () => {
    // api call to get data
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(''); // State for handling errors

    useEffect(() => {
        const fetchRows = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/StudentCourses');
                setRows(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchRows();
    }, []);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Semester</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Grade</TableCell>
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
    )
}

export default CourseTable;