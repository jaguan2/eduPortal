import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    CircularProgress,
} from "@mui/material";

const ListStudentsByMajorTable = () => {
    const [studentsByMajor, setStudentsByMajor] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudentsByMajor = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/getListStudentsByMajor"
                );
                setStudentsByMajor(response.data);
            } catch (err) {
                setError("Failed to fetch students by major.");
            }
        };

        fetchStudentsByMajor();
    }, []);

    // Function to format Student ID
    const formatStudentId = (id) => {
        return `U11${id.toString().padStart(6, "0")}`;
    };

    if (error) {
        return (
            <Container style={{ marginTop: "2rem" }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!studentsByMajor.length) {
        return (
            <Container style={{ marginTop: "2rem", textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body1" style={{ marginTop: "1rem" }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    return (
        <Container style={{ marginTop: "2rem" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Students by Major
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Major</strong></TableCell>
                            <TableCell><strong>Student ID</strong></TableCell>
                            <TableCell><strong>Student Name</strong></TableCell>
                            <TableCell><strong>Total Credits</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentsByMajor.map((student, index) => (
                            <TableRow key={index}>
                                <TableCell>{student.major_name}</TableCell>
                                <TableCell>{formatStudentId(student.student_id)}</TableCell>
                                <TableCell>{student.student_name}</TableCell>
                                <TableCell>{student.total_credits}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ListStudentsByMajorTable;
