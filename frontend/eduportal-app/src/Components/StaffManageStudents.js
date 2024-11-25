import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from "@mui/material";

const StaffManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        username: "",
        password: "",
        major: "",
    });
    const [majors, setMajors] = useState([]); // Options for dropdown
    const [action, setAction] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Fetch Students and Majors
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Students
                const studentsResponse = await axios.get("http://127.0.0.1:5000/getStaffStudents");
                setStudents(studentsResponse.data.students);

                // Fetch Majors
                const majorsResponse = await axios.get("http://127.0.0.1:5000/getStaffMajors");
                setMajors(majorsResponse.data.majors);
            } catch (err) {
                setError("Failed to fetch data.");
            }
        };

        fetchData();
    }, [success]); // Refetch data on successful operation

    // Handle Form Input Changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Submit Form Data
    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        if (!action) {
            setError("Please specify an action (add, update, delete).");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/manage_students", {
                action,
                ...formData,
            });
            setSuccess(response.data.message);
            setFormData({ id: "", username: "", password: "", major: "" });
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred.");
        }
    };

    // Format Student ID
    const formatStudentId = (id) => `U11${id.toString().padStart(6, "0")}`;

    return (
        <Container style={{ marginTop: "2rem" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Manage Students
            </Typography>

            {/* Error and Success Alerts */}
            {error && <Alert severity="error" style={{ marginBottom: "1rem" }}>{error}</Alert>}
            {success && <Alert severity="success" style={{ marginBottom: "1rem" }}>{success}</Alert>}

            {/* Form Section */}
            <Paper style={{ padding: "2rem", marginBottom: "2rem" }}>
                <Typography variant="h5" gutterBottom>
                    Student Form
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Student ID (for Update/Delete)"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Major</InputLabel>
                            <Select
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                required
                            >
                                {majors.map((major) => (
                                    <MenuItem key={major.id} value={major.id}>
                                        {major.majorName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Grid container spacing={2} style={{ marginTop: "1rem" }}>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                setAction("add");
                                handleSubmit();
                            }}
                        >
                            Add Student
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            color="warning"
                            fullWidth
                            onClick={() => {
                                setAction("update");
                                handleSubmit();
                            }}
                        >
                            Update Student
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={() => {
                                setAction("delete");
                                handleSubmit();
                            }}
                        >
                            Delete Student
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Students Table */}
            <Typography variant="h5" align="center" gutterBottom>
                Students List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Student ID</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell>
                                <strong>Password</strong>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    style={{ marginLeft: "1rem" }}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </Button>
                            </TableCell>
                            <TableCell><strong>Major</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student, index) => (
                            <TableRow key={index}>
                                <TableCell>{formatStudentId(student.id)}</TableCell>
                                <TableCell>{student.username}</TableCell>
                                <TableCell>
                                    {showPassword ? student.password : "********"}
                                </TableCell>
                                <TableCell>{student.major}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default StaffManageStudents;
