import React, { useState } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

const StaffDashboard = () => {
    const [reportType, setReportType] = useState("");
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateReport = async () => {
        if (!reportType) {
            setError("Please select a report type.");
            return;
        }

        setLoading(true);
        setError("");
        setReportData([]);

        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/staff/report/${reportType}`);
            setReportData(response.data);
        } catch (err) {
            setError("Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    const renderReportData = () => {
        // Check if report data is an array or string
        if (Array.isArray(reportData) && reportData.length > 0) {
            return (
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(reportData[0]).map((key) => (
                                    <TableCell key={key}>{key}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportData.map((row, index) => (
                                <TableRow key={index}>
                                    {Object.values(row).map((value, idx) => (
                                        <TableCell key={idx}>{value}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        } else if (typeof reportData === "string") {
            return (
                <Typography variant="body1" sx={{ mt: 3 }}>
                    {reportData}
                </Typography>
            );
        } else {
            return <Typography variant="body1" sx={{ mt: 3 }}>No report data available.</Typography>;
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Staff Dashboard - Generate Reports
            </Typography>

            {/* Report Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Report Type</InputLabel>
                <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                >
                    <MenuItem value="GPA_summary">GPA Summary</MenuItem>
                    <MenuItem value="department_ranking">Department Ranking</MenuItem>
                    <MenuItem value="course_enrollment_summary">Course Enrollment Summary</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                sx={{ mb: 2 }}
            >
                Generate Report
            </Button>

            {/* Loading Indicator */}
            {loading && <CircularProgress sx={{ mt: 2 }} />}

            {/* Error Display */}
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {/* Report Data */}
            {reportData && renderReportData()}
        </Container>
    );
};

export default StaffDashboard;
