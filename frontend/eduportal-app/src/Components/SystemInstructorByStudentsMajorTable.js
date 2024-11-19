// export default InstructorStudentsByMajorTable;
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
} from "@mui/material";

const InstructorStudentsByMajorTable = () => {
    const [data, setData] = useState([]); // State to store fetched data
    const [error, setError] = useState(""); // State for error handling

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/getSystemAdminInstructorStudentByMajor"
                );
                setData(response.data); // Update the state with fetched data
            } catch (err) {
                setError("Failed to fetch data.");
            }
        };

        fetchData(); // Fetch data when the component mounts
    }, []);

    // Function to format instructor ID
    const formatInstructorId = (id) => {
        return `U33${id.toString().padStart(6, "0")}`;
    };

    return (
        <Container style={{ marginTop: "2rem" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Instructor Students by Major
            </Typography>
            {error && (
                <Alert severity="error" style={{ marginBottom: "1rem" }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Instructor ID</strong></TableCell>
                            <TableCell><strong>Instructor Name</strong></TableCell>
                            <TableCell><strong>Major</strong></TableCell>
                            <TableCell><strong>Total Students</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{formatInstructorId(item.instructor_id)}</TableCell>
                                <TableCell>{item.instructor_name}</TableCell>
                                <TableCell>{item.major_name}</TableCell>
                                <TableCell>{item.total_students}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default InstructorStudentsByMajorTable;
