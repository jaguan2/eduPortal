// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './SystemAdminGPAStatisticsTable.css'

// const SystemAdminGPAStatisticsTable = () => {
//     const [data, setData] = useState([]);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch('http://127.0.0.1:5000/admin_gpa_statistics');
//                 const result = await response.json();
//                 setData(result);
//             } catch (err) {
//                 setError('Failed to fetch GPA statistics.');
//             }
//         };
//         fetchData();
//     }, []);

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">GPA Statistics by Major</h2>
//             {error && <div className="alert alert-danger">{error}</div>}
//             <table className="table table-striped table-bordered">
//                 <thead>
//                     <tr>
//                         <th>Major</th>
//                         <th>Highest GPA</th>
//                         <th>Lowest GPA</th>
//                         <th>Average GPA</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((item, index) => (
//                         <tr key={index}>
//                             <td>{item.major}</td>
//                             <td>{item.highest_gpa.toFixed(2)}</td>
//                             <td>{item.lowest_gpa.toFixed(2)}</td>
//                             <td>{item.average_gpa.toFixed(2)}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };


// export default SystemAdminGPAStatisticsTable;

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
    Alert,
    CircularProgress,
} from '@mui/material';

const SystemAdminGPAStatisticsTable = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/admin_gpa_statistics');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError('Failed to fetch GPA statistics.');
            }
        };
        fetchData();
    }, []);

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                GPA Statistics by Major
            </Typography>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" style={{ marginBottom: '1rem' }}>
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {!data.length && !error && (
                <Container style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <CircularProgress />
                    <Typography variant="body1" style={{ marginTop: '0.5rem' }}>
                        Loading GPA statistics...
                    </Typography>
                </Container>
            )}

            {/* GPA Statistics Table */}
            {data.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Major</strong></TableCell>
                                <TableCell><strong>Highest GPA</strong></TableCell>
                                <TableCell><strong>Lowest GPA</strong></TableCell>
                                <TableCell><strong>Average GPA</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.major}</TableCell>
                                    <TableCell>{item.highest_gpa.toFixed(2)}</TableCell>
                                    <TableCell>{item.lowest_gpa.toFixed(2)}</TableCell>
                                    <TableCell>{item.average_gpa.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default SystemAdminGPAStatisticsTable;
