import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const CourseTable = (data) => {

    // api call to get data

    return (
        <TableContainer component={Paper}>
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