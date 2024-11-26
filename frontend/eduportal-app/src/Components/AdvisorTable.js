// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Typography,
//     Button,
//     CircularProgress,
//     Alert,
//     Box,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
// } from '@mui/material';

// const AdvisorTable = () => {
//     const [rows, setRows] = useState([]); // List of students
//     const [error, setError] = useState(''); // Error state
//     const [loading, setLoading] = useState(true); // Loading state
//     const [courses, setCourses] = useState([]); // List of courses (add/drop)
//     const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for add/drop
//     const [actionType, setActionType] = useState(''); // "add" or "drop"
//     const [loadingCourses, setLoadingCourses] = useState(false); // Loading state for courses

//     // Fetch students on mount
//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/advisorStudentList');
//                 setRows(response.data); // Populate student data
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStudents();
//     }, []);

//     // Fetch courses for add/drop
//     const fetchCourses = async (studentId, type) => {
//         setLoadingCourses(true);
//         setActionType(type);
//         try {
//             const endpoint = type === 'add'
//                 ? `http://127.0.0.1:5000/addClass/${studentId}`
//                 : `http://127.0.0.1:5000/dropClass/${studentId}`;
//             const response = await axios.get(endpoint);
//             setCourses(response.data); // Populate courses list
//             setSelectedStudent(studentId); // Set the selected student
//         } catch (error) {
//             setCourses([]);
//             alert(error.response?.data?.error || `Error fetching courses to ${type}`);
//         } finally {
//             setLoadingCourses(false);
//         }
//     };

//     // Add or drop a course
//     const handleCourseAction = async (courseId) => {
//         if (!selectedStudent) return;
//         try {
//             const endpoint = actionType === 'add'
//                 ? `http://127.0.0.1:5000/addClass/${selectedStudent}`
//                 : `http://127.0.0.1:5000/dropClass/${selectedStudent}`;
//             const payload =
//                 actionType === 'add' ? { courseIds: [courseId] } : { course_ids: [courseId] };

//             const response = await axios.post(endpoint, payload);
//             alert(response.data.message); // Notify user of success
//             setCourses(courses.filter((course) => course.id !== courseId)); // Remove processed course from the list
//         } catch (error) {
//             alert(error.response?.data?.error || `Error processing ${actionType} course`);
//         }
//     };

//     // Close the dialog
//     const closeDialog = () => {
//         setSelectedStudent(null);
//         setCourses([]);
//         setActionType('');
//     };

//     // Format ID: Add prefix "U11" and pad to 9 characters
//     const formatStudentId = (id) => `U11${id.toString().padStart(6, '0')}`;

//     // Display loader while fetching data
//     if (loading) {
//         return (
//             <Box textAlign="center" marginTop={4}>
//                 <CircularProgress />
//                 <Typography variant="body1" style={{ marginTop: '1rem' }}>
//                     Loading students...
//                 </Typography>
//             </Box>
//         );
//     }

//     // Display error if data fetch fails
//     if (error) {
//         return (
//             <Box textAlign="center" marginTop={4}>
//                 <Alert severity="error">{error}</Alert>
//             </Box>
//         );
//     }

//     return (
//         <Box marginTop={4}>
//             <Typography variant="h5" align="center" gutterBottom>
//                 Advisor's Student List
//             </Typography>
//             <TableContainer component={Paper} elevation={3} style={{ marginTop: '1rem' }}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell sx={{ paddingLeft: '2rem', paddingRight: '1rem' }}>
//                                 <strong>ID</strong>
//                             </TableCell>
//                             <TableCell><strong>Username</strong></TableCell>
//                             <TableCell><strong>Major</strong></TableCell>
//                             <TableCell align="center"><strong>Add</strong></TableCell>
//                             <TableCell align="center"><strong>Drop</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {rows.map((row) => (
//                             <TableRow key={row.id}>
//                                 <TableCell sx={{ paddingLeft: '2rem', paddingRight: '1rem' }}>
//                                     {formatStudentId(row.id)}
//                                 </TableCell>
//                                 <TableCell>{row.username}</TableCell>
//                                 <TableCell>{row.major}</TableCell>
//                                 <TableCell align="center">
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         size="small"
//                                         onClick={() => fetchCourses(row.id, 'add')}
//                                     >
//                                         Add
//                                     </Button>
//                                 </TableCell>
//                                 <TableCell align="center">
//                                     <Button
//                                         variant="contained"
//                                         color="secondary"
//                                         size="small"
//                                         onClick={() => fetchCourses(row.id, 'drop')}
//                                     >
//                                         Drop
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Dialog for displaying courses */}
//             <Dialog open={!!selectedStudent} onClose={closeDialog} fullWidth maxWidth="sm">
//                 <DialogTitle>
//                     {actionType === 'add' ? 'Available Courses to Add' : 'Enrolled Courses to Drop'}
//                 </DialogTitle>
//                 <DialogContent>
//                     {loadingCourses ? (
//                         <Box textAlign="center" marginY={2}>
//                             <CircularProgress />
//                             <Typography variant="body1">Loading courses...</Typography>
//                         </Box>
//                     ) : courses.length > 0 ? (
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell><strong>Course ID</strong></TableCell>
//                                     <TableCell><strong>Course Name</strong></TableCell>
//                                     <TableCell align="center"><strong>Action</strong></TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {courses.map((course) => (
//                                     <TableRow key={course.id}>
//                                         <TableCell>{course.id}</TableCell>
//                                         <TableCell>{course.name}</TableCell>
//                                         <TableCell align="center">
//                                             <Button
//                                                 variant="contained"
//                                                 color="primary"
//                                                 size="small"
//                                                 onClick={() => handleCourseAction(course.id)}
//                                             >
//                                                 {actionType === 'add' ? 'Add' : 'Drop'}
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     ) : (
//                         <Typography variant="body2" color="textSecondary" align="center">
//                             No courses available to {actionType}.
//                         </Typography>
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={closeDialog} color="primary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default AdvisorTable;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

const AdvisorTable = () => {
    const [rows, setRows] = useState([]); // List of students
    const [error, setError] = useState(''); // Error state
    const [loading, setLoading] = useState(true); // Loading state
    const [courses, setCourses] = useState([]); // List of courses (add/drop)
    const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for add/drop
    const [actionType, setActionType] = useState(''); // "add" or "drop"
    const [loadingCourses, setLoadingCourses] = useState(false); // Loading state for courses

    // Fetch students on mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/advisorStudentList');
                setRows(response.data); // Populate student data
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Fetch courses for add/drop
    const fetchCourses = async (studentId, type) => {
        setLoadingCourses(true);
        setActionType(type);
        try {
            const endpoint = type === 'add'
                ? `http://127.0.0.1:5000/addClass/${studentId}`
                : `http://127.0.0.1:5000/dropClass/${studentId}`;
            const response = await axios.get(endpoint);
            setCourses(response.data); // Populate courses list
            setSelectedStudent(studentId); // Set the selected student
        } catch (error) {
            setCourses([]);
            alert(error.response?.data?.error || `Error fetching courses to ${type}`);
        } finally {
            setLoadingCourses(false);
        }
    };

    // Add or drop a course
    const handleCourseAction = async (courseId) => {
        if (!selectedStudent) return;
        try {
            const endpoint = actionType === 'add'
                ? `http://127.0.0.1:5000/addClass/${selectedStudent}`
                : `http://127.0.0.1:5000/dropClass/${selectedStudent}`;
            const payload =
                actionType === 'add' ? { courseIds: [courseId] } : { course_ids: [courseId] };

            const response = await axios.post(endpoint, payload);
            alert(response.data.message); // Notify user of success
            setCourses(courses.filter((course) => course.id !== courseId)); // Remove processed course from the list
        } catch (error) {
            alert(error.response?.data?.error || `Error processing ${actionType} course`);
        }
    };

    // Close the dialog
    const closeDialog = () => {
        setSelectedStudent(null);
        setCourses([]);
        setActionType('');
    };

    // Format ID: Add prefix "U11" and pad to 9 characters
    const formatStudentId = (id) => `U11${id.toString().padStart(6, '0')}`;

    // Display loader while fetching data
    if (loading) {
        return (
            <Box textAlign="center" marginTop={4}>
                <CircularProgress />
                <Typography variant="body1" style={{ marginTop: '1rem' }}>
                    Loading students...
                </Typography>
            </Box>
        );
    }

    // Display error if data fetch fails
    if (error) {
        return (
            <Box textAlign="center" marginTop={4}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box marginTop={4}>
            <Typography variant="h5" align="center" gutterBottom>
                Student List
            </Typography>
            <TableContainer component={Paper} elevation={3} style={{ marginTop: '1rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ paddingLeft: '2rem', paddingRight: '1rem' }}>
                                <strong>ID</strong>
                            </TableCell>
                            <TableCell><strong>Username</strong></TableCell>
                            <TableCell><strong>Major</strong></TableCell>
                            <TableCell align="center"><strong>Add</strong></TableCell>
                            <TableCell align="center"><strong>Drop</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell sx={{ paddingLeft: '2rem', paddingRight: '1rem' }}>
                                    {formatStudentId(row.id)}
                                </TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.major}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => fetchCourses(row.id, 'add')}
                                    >
                                        Add
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => fetchCourses(row.id, 'drop')}
                                    >
                                        Drop
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for displaying courses */}
            <Dialog open={!!selectedStudent} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {actionType === 'add' ? 'Available Courses to Add' : 'Enrolled Courses to Drop'}
                </DialogTitle>
                <DialogContent>
                    {loadingCourses ? (
                        <Box textAlign="center" marginY={2}>
                            <CircularProgress />
                            <Typography variant="body1">Loading courses...</Typography>
                        </Box>
                    ) : courses.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Course ID</strong></TableCell>
                                    <TableCell><strong>Course Name</strong></TableCell>
                                    <TableCell align="center"><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {courses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>{course.id}</TableCell>
                                        <TableCell>{course.courseName}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleCourseAction(course.id)}
                                            >
                                                {actionType === 'add' ? 'Add' : 'Drop'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="body2" color="textSecondary" align="center">
                            No courses available to {actionType}.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdvisorTable;
