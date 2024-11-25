// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const SystemAdminSemesterCourseStatsTable = () => {
//     const [courseStats, setCourseStats] = useState([]);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchCourseStats = async () => {
//             try {
//                 const response = await axios.get("http://127.0.0.1:5000/getSystemAdminSemesterCourseStats");
//                 setCourseStats(response.data);
//             } catch (err) {
//                 setError("Failed to fetch course statistics.");
//             }
//         };

//         fetchCourseStats();
//     }, []);

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center mb-4">Course Statistics by Semester</h1>
//             {error && <div className="alert alert-danger">{error}</div>}

//             <table className="table table-striped table-bordered">
//                 <thead>
//                     <tr>
//                         <th scope="col">Course Code</th>
//                         <th scope="col">Course Name</th>
//                         <th scope="col">Semester</th>
//                         <th scope="col">Year</th>
//                         <th scope="col">Total Enrollments</th>
//                         <th scope="col">Average Grade</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {courseStats.map((stat) => (
//                         <tr key={stat.course_id}>
//                             <td>{stat.course_code}</td>
//                             <td>{stat.course_name}</td>
//                             <td>{stat.semester}</td>
//                             <td>{stat.year}</td>
//                             <td>{stat.total_enrollments}</td>
//                             <td>{stat.average_grade !== null ? stat.average_grade.toFixed(2) : "N/A"}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default SystemAdminSemesterCourseStatsTable;
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

const SystemAdminSemesterCourseStatsTable = () => {
    const [courseStats, setCourseStats] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourseStats = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/getSystemAdminSemesterCourseStats"
                );
                setCourseStats(response.data);
            } catch (err) {
                setError("Failed to fetch course statistics.");
            }
        };

        fetchCourseStats();
    }, []);

    return (
        <Container style={{ marginTop: "2rem" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Course Statistics by Semester
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
                            <TableCell><strong>Course Code</strong></TableCell>
                            <TableCell><strong>Course Name</strong></TableCell>
                            <TableCell><strong>Semester</strong></TableCell>
                            <TableCell><strong>Year</strong></TableCell>
                            <TableCell><strong>Total Enrollments</strong></TableCell>
                            <TableCell><strong>Average Grade</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courseStats.map((stat) => (
                            <TableRow key={stat.course_id}>
                                <TableCell>{stat.course_code}</TableCell>
                                <TableCell>{stat.course_name}</TableCell>
                                <TableCell>{stat.semester}</TableCell>
                                <TableCell>{stat.year}</TableCell>
                                <TableCell>{stat.total_enrollments}</TableCell>
                                <TableCell>
                                    {stat.average_grade !== null
                                        ? stat.average_grade.toFixed(2)
                                        : "N/A"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default SystemAdminSemesterCourseStatsTable;
