// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import './AdvisorTable.css';

// const AdvisorTable = () => {
//     // api call to get data
//     const [rows, setRows] = useState([]);
//     const [error, setError] = useState(''); // State for handling errors

//     useEffect(() => {
//         const fetchStudents = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/advisorStudentList');
//                 console.log(response.data)
//                 setRows(response.data);  // Set the list of students
//             } catch (error) {
//                 if (error.response) {
//                     setError(error.response.data.error);
//                 } else {
//                     setError('An unexpected error occurred!');
//                 }
//             }
//         };
    
//         fetchStudents();
//     }, []);  // Runs only once on component mount
    

//     return (
//         <table className="table table-striped container">
//             <thead>
//                 <tr>
//                     <th scope="col">ID</th>
//                     <th scope="col">Username</th>
//                     <th scope="col">Major</th>
//                     <th scope="col">Add</th>
//                     <th scope="col">Drop</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {rows.map((data, index) => (
//                     <tr>
//                         <td scope="row">{data.id}</td>
//                         <td scope="row">{data.username}</td>
//                         <td scope="row">{data.major}</td>
//                         <td scope="row">
//                             <button type="button" className="col btn btn-primary custom-sizing">
//                                 +
//                             </button>
//                         </td>
//                         <td scope="row">
//                             <button type="button" className="col btn btn-primary custom-sizing">
//                                 -
//                             </button>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     )
// }

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
} from '@mui/material';

const AdvisorTable = () => {
    const [rows, setRows] = useState([]); // Holds the list of students
    const [error, setError] = useState(''); // Holds any error messages
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch student data when the component mounts
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/advisorStudentList');
                setRows(response.data); // Set rows with fetched data
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            } finally {
                setLoading(false); // Set loading to false regardless of success/failure
            }
        };

        fetchStudents();
    }, []);

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
                Advisor's Student List
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
                        {rows.map((row, index) => (
                            <TableRow key={index}>
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
                                    >
                                        +
                                    </Button>
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                    >
                                        -
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdvisorTable;
