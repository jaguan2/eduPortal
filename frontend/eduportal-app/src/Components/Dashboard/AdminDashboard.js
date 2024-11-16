import React, { useEffect, useState } from "react";
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
} from "@mui/material";

const AdminDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch logs
        axios.get("http://127.0.0.1:5000/api/admin/logs")
            .then((response) => setLogs(response.data))
            .catch(() => setError("Failed to fetch logs."));
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard - Logs
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell>{log.timestamp}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell>{log.role}</TableCell>
                                <TableCell>{log.action}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminDashboard;
