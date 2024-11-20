// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios'; // Import Axios
// import './InstructorCourseTable.css'

// const CourseTable = ({ semester, year, onSelectCourses }) => {
//     // api call to get data
//     const [rows, setRows] = useState([]);
//     // const [selectedCourse, setSelectedCourse] = null([]);
//     const [showNewTable, setShowNewTable] = useState(false);
//     const [courseStudents, setCourseStudents] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(''); // State for handling errors

//     useEffect(() => {
//         const fetchRows = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/InstructorCourses');
//                 console.log(response.data)
//                 setRows(response.data);
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };

//         fetchRows();
//     }, []);

//     // Filer rows based on semester and year
//     const filteredRows = rows.filter(row => {
//         return (
//             (!semester || row.semester.toLowerCase() === semester.toLowerCase()) &&
//             (!parseInt(year) || parseInt(row.year) === parseInt(year))
//         );
//     });

//     const handleShowNewTable = async (courseId) => {
//         setLoading(true);
//         setShowNewTable(true);
//         setCourseStudents([]);
//         try {
//             const response = await axios.post('http://127.0.0.1:5000/getCourseStudents', {id: courseId});

//             if (response.data && response.data.length > 0) {
//                 setCourseStudents(response.data);
//             } else {
//                 setCourseStudents([]);
//             }
//         } catch (error) {
//             console.error('Erorr fetching data', error);
//             setCourseStudents([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleBackToTable = () => {
//         setShowNewTable(false);
//     }

//     return (
//         <div>
//             {
//                 showNewTable ? (
//                     <div>
//                         <table className="table table-striped container">
//                         <thead>
//                             <tr>
//                                 <th scope="col">Student ID</th>
//                                 <th scope="col">Student Name</th>
//                                 <th scope="col">Grade</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {courseStudents.map((data, index) => (
//                                 <tr key={index}>
//                                     <td scope="row">{data.id}</td>
//                                     <td scope="row">{data.name}</td>
//                                     <td scope="row">{data.grade}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                         </table>
//                         <button onClick={handleBackToTable}>Back</button>
//                     </div>
//                 ) : (
//                     <div>
//                         <table className="table table-striped container">
//                         <thead>
//                             <tr>
//                                 <th scope="col">Course ID</th>
//                                 <th scope="col">Course</th>
//                                 <th scope="col">Semester</th>
//                                 <th scope="col">Year</th>
//                                 <th scope="col">Select</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredRows.map((data, index) => (
//                                 <tr key={index}>
//                                     <td scope="row">{data.courseid}</td>
//                                     <td scope="row">{data.course}</td>
//                                     <td scope="row">{data.semester}</td>
//                                     <td scope="row">{data.year}</td>
//                                     <td scope="row">
//                                         <button className="btn btn-outline-primary"
//                                             onClick={() => handleShowNewTable(data.courseid)}
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                         </table>
//                     </div>
//                 )
//             }
//         </div>

//     )
// }

// export default CourseTable;

import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Button,
    Box,
    Alert,
} from '@mui/material';
import axios from 'axios';

const CourseTable = ({ semester, year }) => {
    const [rows, setRows] = useState([]);
    const [showNewTable, setShowNewTable] = useState(false);
    const [courseStudents, setCourseStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRows = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/InstructorCourses');
                setRows(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.error || 'An unexpected error occurred!'
                );
            }
        };

        fetchRows();
    }, []);

    const filteredRows = rows.filter((row) =>
        (!semester || row.semester.toLowerCase() === semester.toLowerCase()) &&
        (!parseInt(year) || parseInt(row.year) === parseInt(year))
    );

    const handleShowNewTable = async (courseId) => {
        setLoading(true);
        setShowNewTable(true);
        setCourseStudents([]);
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/getCourseStudents',
                { id: courseId }
            );

            setCourseStudents(response.data || []);
        } catch (error) {
            setCourseStudents([]);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToTable = () => {
        setShowNewTable(false);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
            {error && (
                <Alert severity="error" style={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            )}
            {showNewTable ? (
                <Box>
                    <Typography variant="h5" align="center" gutterBottom>
                        Student List
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Student ID</strong></TableCell>
                                    <TableCell><strong>Student Name</strong></TableCell>
                                    <TableCell><strong>Grade</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courseStudents.map((student, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.grade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box marginTop={2} display="flex" justifyContent="center">
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleBackToTable}
                        >
                            Back
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h5" align="center" gutterBottom>
                        Course List
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Course ID</strong></TableCell>
                                    <TableCell><strong>Course</strong></TableCell>
                                    <TableCell><strong>Semester</strong></TableCell>
                                    <TableCell><strong>Year</strong></TableCell>
                                    <TableCell><strong>Select</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.map((course, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{course.courseid}</TableCell>
                                        <TableCell>{course.course}</TableCell>
                                        <TableCell>{course.semester}</TableCell>
                                        <TableCell>{course.year}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => handleShowNewTable(course.courseid)}
                                            >
                                                Select
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
            {loading && (
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
};

export default CourseTable;
