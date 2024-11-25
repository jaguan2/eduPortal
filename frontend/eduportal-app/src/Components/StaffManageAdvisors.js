// // // export default StaffManageAdvisors;
// // import React, { useState } from 'react';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import StaffAdvisorsTable from './StaffAdvisorsTable'; // Import the AdvisorsTable component

// // const StaffManageAdvisors = () => {
// //     const [id, setId] = useState('');
// //     const [username, setUsername] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [department, setDepartment] = useState('');
// //     const [action, setAction] = useState('');
// //     const [success, setSuccess] = useState('');
// //     const [error, setError] = useState('');

// //     const handleSubmit = async () => {
// //         try {
// //             const response = await fetch('http://127.0.0.1:5000/manage_advisors', {
// //                 method: 'POST',
// //                 headers: { 'Content-Type': 'application/json' },
// //                 body: JSON.stringify({ action, id, username, password, department }),
// //             });
// //             const data = await response.json();

// //             if (response.ok) {
// //                 setSuccess(data.message);
// //                 setError('');
// //             } else {
// //                 setError(data.error);
// //                 setSuccess('');
// //             }
// //         } catch (err) {
// //             setError('Operation failed. Please try again.');
// //             setSuccess('');
// //         }
// //     };

// //     return (
// //         <div className="container mt-5">
// //             <h1 className="text-center mb-4">Manage Advisors</h1>

// //             {error && <div className="alert alert-danger">{error}</div>}
// //             {success && <div className="alert alert-success">{success}</div>}

// //             <div className="card p-4 mb-5">
// //                 <h2>Advisor Form</h2>
// //                 <div className="form-group mb-3">
// //                     <label>ID</label>
// //                     <input
// //                         type="text"
// //                         className="form-control"
// //                         value={id}
// //                         onChange={(e) => setId(e.target.value)}
// //                     />
// //                 </div>
// //                 <div className="form-group mb-3">
// //                     <label>Username</label>
// //                     <input
// //                         type="text"
// //                         className="form-control"
// //                         value={username}
// //                         onChange={(e) => setUsername(e.target.value)}
// //                         required
// //                     />
// //                 </div>
// //                 <div className="form-group mb-3">
// //                     <label>Password</label>
// //                     <input
// //                         type="password"
// //                         className="form-control"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                     />
// //                 </div>
// //                 <div className="form-group mb-3">
// //                     <label>Department</label>
// //                     <input
// //                         type="text"
// //                         className="form-control"
// //                         value={department}
// //                         onChange={(e) => setDepartment(e.target.value)}
// //                     />
// //                 </div>
// //                 <div className="d-flex gap-2">
// //                     <button
// //                         className="btn btn-primary"
// //                         onClick={() => {
// //                             setAction('add');
// //                             handleSubmit();
// //                         }}
// //                     >
// //                         Add Advisor
// //                     </button>
// //                     <button
// //                         className="btn btn-warning"
// //                         onClick={() => {
// //                             setAction('update');
// //                             handleSubmit();
// //                         }}
// //                     >
// //                         Update Advisor
// //                     </button>
// //                     <button
// //                         className="btn btn-danger"
// //                         onClick={() => {
// //                             setAction('delete');
// //                             handleSubmit();
// //                         }}
// //                     >
// //                         Delete Advisor
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Include the AdvisorsTable component */}
// //             <StaffAdvisorsTable />
// //         </div>
// //     );
// // };

// // export default StaffManageAdvisors;

// import React, { useState } from 'react';
// import {
//     Container,
//     Typography,
//     Paper,
//     TextField,
//     Button,
//     Box,
//     Alert,
//     Grid,
// } from '@mui/material';
// import StaffAdvisorsTable from './StaffAdvisorsTable'; // Import the AdvisorsTable component

// const StaffManageAdvisors = () => {
//     const [id, setId] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [department, setDepartment] = useState('');
//     const [action, setAction] = useState('');
//     const [success, setSuccess] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = async () => {
//         try {
//             const response = await fetch('http://127.0.0.1:5000/manage_advisors', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ action, id, username, password, department }),
//             });
//             const data = await response.json();

//             if (response.ok) {
//                 setSuccess(data.message);
//                 setError('');
//             } else {
//                 setError(data.error);
//                 setSuccess('');
//             }
//         } catch (err) {
//             setError('Operation failed. Please try again.');
//             setSuccess('');
//         }
//     };

//     return (
//         <Container style={{ marginTop: '2rem' }}>
//             {/* Page Header */}
//             <Typography variant="h4" align="center" gutterBottom>
//                 Manage Advisors
//             </Typography>

//             {/* Success and Error Alerts */}
//             {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
//             {success && <Alert severity="success" style={{ marginBottom: '1rem' }}>{success}</Alert>}

//             {/* Advisor Form */}
//             <Paper style={{ padding: '2rem', marginBottom: '2rem' }}>
//                 <Typography variant="h5" gutterBottom>
//                     Advisor Form
//                 </Typography>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="ID"
//                             value={id}
//                             onChange={(e) => setId(e.target.value)}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Username"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <TextField
//                             fullWidth
//                             label="Department"
//                             value={department}
//                             onChange={(e) => setDepartment(e.target.value)}
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* Action Buttons */}
//                 <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => {
//                             setAction('add');
//                             handleSubmit();
//                         }}
//                     >
//                         Add Advisor
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="warning"
//                         onClick={() => {
//                             setAction('update');
//                             handleSubmit();
//                         }}
//                     >
//                         Update Advisor
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="error"
//                         onClick={() => {
//                             setAction('delete');
//                             handleSubmit();
//                         }}
//                     >
//                         Delete Advisor
//                     </Button>
//                 </Box>
//             </Paper>

//             {/* Advisors Table */}
//             <StaffAdvisorsTable />
//         </Container>
//     );
// };

// export default StaffManageAdvisors;
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Box,
    Alert,
    Grid,
} from '@mui/material';
import StaffAdvisorsTable from './StaffAdvisorsTable';

const StaffManageAdvisors = () => {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [action, setAction] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setSuccess('');
        setError('');

        // Validate all fields
        if (
            action === 'add' &&
            (!username || !password || !department)
        ) {
            setError('All fields are required for adding an advisor.');
            return;
        }

        if (
            action === 'update' &&
            (!id || !username || !password || !department)
        ) {
            setError('All fields are required for updating an advisor.');
            return;
        }

        if (action === 'delete' && !id) {
            setError('ID is required to delete an advisor.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/manage_advisors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, id, username, password, department }),
            });
            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setError('');
                // Reset form fields
                setId('');
                setUsername('');
                setPassword('');
                setDepartment('');
            } else {
                setError(data.error);
                setSuccess('');
            }
        } catch (err) {
            setError('Operation failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Manage Advisors
            </Typography>

            {/* Success and Error Alerts */}
            {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
            {success && <Alert severity="success" style={{ marginBottom: '1rem' }}>{success}</Alert>}

            {/* Advisor Form */}
            <Paper style={{ padding: '2rem', marginBottom: '2rem' }}>
                <Typography variant="h5" gutterBottom>
                    Advisor Form
                </Typography>
                <Grid container spacing={2}>
                    {action !== 'add' && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                required
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                        />
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setAction('add');
                            handleSubmit();
                        }}
                    >
                        Add Advisor
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            setAction('update');
                            handleSubmit();
                        }}
                    >
                        Update Advisor
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setAction('delete');
                            handleSubmit();
                        }}
                    >
                        Delete Advisor
                    </Button>
                </Box>
            </Paper>

            {/* Advisors Table */}
            <StaffAdvisorsTable />
        </Container>
    );
};

export default StaffManageAdvisors;
