// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const StaffStudentsTable = () => {
//     const [students, setStudents] = useState([]);
//     const [department, setDepartment] = useState(""); // State for department name
//     const [error, setError] = useState("");
//     const [showPasswords, setShowPasswords] = useState(false); // State to toggle password visibility

//     // Fetch students and department name when the component mounts
//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 const response = await axios.get("http://127.0.0.1:5000/getStaffStudents");
//                 setStudents(response.data.students);
//             } catch (err) {
//                 setError("Failed to fetch students.");
//             }
//         };

//         const fetchDepartment = async () => {
//             try {
//                 const response = await axios.get("http://127.0.0.1:5000/getStaffDepartment");
//                 setDepartment(response.data.department); // Extract department name
//             } catch (err) {
//                 setError("Failed to fetch department name.");
//             }
//         };

//         fetchStudents();
//         fetchDepartment();
//     }, []);

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center mb-4">
//                 Students in {department ? `${department} Department` : "Your Department"}
//             </h1>
//             {error && <div className="alert alert-danger">{error}</div>}

//             {/* Toggle Button */}
//             <div className="text-end mb-3">
//                 <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => setShowPasswords((prev) => !prev)}
//                 >
//                     {showPasswords ? "Hide Passwords" : "Show Passwords"}
//                 </button>
//             </div>

//             <table className="table table-striped table-bordered">
//                 <thead>
//                     <tr>
//                         <th scope="col">ID</th>
//                         <th scope="col">Username</th>
//                         <th scope="col">Password</th>
//                         <th scope="col">Major</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {students.map((student) => (
//                         <tr key={student.id}>
//                             <td>{student.id}</td>
//                             <td>{student.username}</td>
//                             <td>{showPasswords ? student.password : "******"}</td>
//                             <td>{student.major}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default StaffStudentsTable;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
} from "@mui/material";

const StaffStudentsTable = () => {
    const [students, setStudents] = useState([]);
    const [department, setDepartment] = useState(""); // State for department name
    const [error, setError] = useState("");
    const [showPasswords, setShowPasswords] = useState(false); // State to toggle password visibility

    // Fetch students and department name when the component mounts
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/getStaffStudents");
                setStudents(response.data.students);
            } catch (err) {
                setError("Failed to fetch students.");
            }
        };

        const fetchDepartment = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/getStaffDepartment");
                setDepartment(response.data.department); // Extract department name
            } catch (err) {
                setError("Failed to fetch department name.");
            }
        };

        fetchStudents();
        fetchDepartment();
    }, []);

    return (
        <Container style={{ marginTop: "2rem" }}>
            {/* Header */}
            <Typography variant="h4" align="center" gutterBottom>
                Students in {department ? `${department} Department` : "Your Department"}
            </Typography>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" style={{ marginBottom: "1rem" }}>
                    {error}
                </Alert>
            )}

            {/* Toggle Button */}
            <Box textAlign="end" marginBottom={2}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowPasswords((prev) => !prev)}
                >
                    {showPasswords ? "Hide Passwords" : "Show Passwords"}
                </Button>
            </Box>

            {/* Students Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Password</strong></TableCell>
                            <TableCell><strong>Major</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.id}</TableCell>
                                <TableCell>{student.username}</TableCell>
                                <TableCell>{showPasswords ? student.password : "******"}</TableCell>
                                <TableCell>{student.major}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default StaffStudentsTable;
