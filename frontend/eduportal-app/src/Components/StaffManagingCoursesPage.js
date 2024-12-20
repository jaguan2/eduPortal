// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';
// import './StaffManagingCoursesPage.css';
// import StaffCoursesTable from './StaffCoursesTable';
// import StaffInstructorsTable from './StaffInstructorsTable';


// const ManageCoursesPage = () => {
//     const [courseId, setCourseId] = useState('');
//     const [coursePrefix, setCoursePrefix] = useState('');
//     const [courseNumber, setCourseNumber] = useState('');
//     const [courseName, setCourseName] = useState('');
//     const [credits, setCredits] = useState('');
//     const [semester, setSemester] = useState('');
//     const [year, setYear] = useState('');
//     const [classTime, setClassTime] = useState('');
//     const [classDay, setClassDay] = useState('');
//     const [instructorId, setInstructorId] = useState('');
//     const [courses, setCourses] = useState([]);
//     const [instructors, setInstructors] = useState([]);
//     const [action, setAction] = useState('add');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [loading, setLoading] = useState(false);

//     // Fetch courses and instructors when the page loads
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const coursesResponse = await axios.get('http://127.0.0.1:5000/getStaffCourses');
//                 setCourses(coursesResponse.data);

//                 const instructorsResponse = await axios.get('http://127.0.0.1:5000/getStaffInstructors');
//                 setInstructors(instructorsResponse.data);
//             } catch (error) {
//                 setError('Failed to fetch courses or instructors');
//             }
//         };

//         fetchData();
//     }, []);

//     const handleSubmit = async () => {
//         setLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             const response = await axios.post('http://127.0.0.1:5000/manage_courses', {
//                 action,
//                 id: courseId,
//                 prefix: coursePrefix,
//                 number: courseNumber,
//                 courseName,
//                 credits,
//                 semester,
//                 year,
//                 classTime,
//                 classDay,
//                 instructor: instructorId,
//             });

//             setSuccess(response.data.message);
//         } catch (error) {
//             setError(error.response?.data?.error || 'An error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center mb-4">Manage Courses</h1>

//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">{success}</div>}

//             {/* Add, Update, Delete Course Form */}
//             <div className="card p-4 mb-5">
//                 <h2>Course Form</h2>
//                 <div className="form-group mb-3">
//                     <label>Course ID</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={courseId}
//                         onChange={(e) => setCourseId(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Course Prefix</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={coursePrefix}
//                         onChange={(e) => setCoursePrefix(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Course Number</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={courseNumber}
//                         onChange={(e) => setCourseNumber(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Course Name</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={courseName}
//                         onChange={(e) => setCourseName(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Credits</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         value={credits}
//                         onChange={(e) => setCredits(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Semester</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={semester}
//                         onChange={(e) => setSemester(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Year</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         value={year}
//                         onChange={(e) => setYear(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Class Time</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={classTime}
//                         onChange={(e) => setClassTime(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Class Day</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={classDay}
//                         onChange={(e) => setClassDay(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Instructor</label>
//                     <select
//                         className="form-select"
//                         value={instructorId}
//                         onChange={(e) => setInstructorId(e.target.value)}
//                     >
//                         <option value="">Select an Instructor</option>
//                         {instructors.map((instructor) => (
//                             <option key={instructor.instructor_id} value={instructor.instructor_id}>
//                                 {instructor.username} (ID: {instructor.instructor_id})
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="d-flex gap-2">
//                     <button className="btn btn-primary" onClick={() => { setAction('add'); handleSubmit(); }}>
//                         Add Course
//                     </button>
//                     <button className="btn btn-warning" onClick={() => { setAction('update'); handleSubmit(); }}>
//                         Update Course
//                     </button>
//                     <button className="btn btn-danger" onClick={() => { setAction('delete'); handleSubmit(); }}>
//                         Delete Course
//                     </button>
//                 </div>
//             </div>

//             {/* Tables Section */}
//             <div className="row">
//                 <StaffCoursesTable courses={courses} />
//                 <StaffInstructorsTable instructors={instructors} />
//             </div>
//         </div>
//     );
// };

// export default ManageCoursesPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Box,
    Paper,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import StaffCoursesTable from './StaffCoursesTable';
import StaffInstructorsTable from './StaffInstructorsTable';

const ManageCoursesPage = () => {
    const [courseId, setCourseId] = useState('');
    const [coursePrefix, setCoursePrefix] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [courseName, setCourseName] = useState('');
    const [credits, setCredits] = useState('');
    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');
    const [classTime, setClassTime] = useState('');
    const [classDay, setClassDay] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [action, setAction] = useState('add');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch courses and instructors when the page loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesResponse = await axios.get('http://127.0.0.1:5000/getStaffCourses');
                setCourses(coursesResponse.data);

                const instructorsResponse = await axios.get('http://127.0.0.1:5000/getStaffInstructors');
                setInstructors(instructorsResponse.data);
            } catch (error) {
                setError('Failed to fetch courses or instructors');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://127.0.0.1:5000/manage_courses', {
                action,
                id: courseId,
                prefix: coursePrefix,
                number: courseNumber,
                courseName,
                credits,
                semester,
                year,
                classTime,
                classDay,
                instructor: instructorId,
            });

            setSuccess(response.data.message);
        } catch (error) {
            setError(error.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={{ marginTop: '2rem' }}>
            {/* Header */}
            <Typography variant="h4" align="center" gutterBottom>
                Manage Courses
            </Typography>

            {/* Error and Success Alerts */}
            {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
            {success && <Alert severity="success" style={{ marginBottom: '1rem' }}>{success}</Alert>}

            {/* Course Form */}
            <Paper style={{ padding: '2rem', marginBottom: '2rem' }}>
                <Typography variant="h5" gutterBottom>
                    Course Form
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Course ID"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Course Prefix"
                            value={coursePrefix}
                            onChange={(e) => setCoursePrefix(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Course Number"
                            value={courseNumber}
                            onChange={(e) => setCourseNumber(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Course Name"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Credits"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Semester"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Class Time"
                            value={classTime}
                            onChange={(e) => setClassTime(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Class Day"
                            value={classDay}
                            onChange={(e) => setClassDay(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Instructor</InputLabel>
                            <Select
                                value={instructorId}
                                onChange={(e) => setInstructorId(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="">Select an Instructor</MenuItem>
                                {instructors.map((instructor) => (
                                    <MenuItem key={instructor.instructor_id} value={instructor.instructor_id}>
                                        {instructor.username} (ID: {instructor.instructor_id})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Buttons */}
                <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
                    <Button variant="contained" color="primary" onClick={() => { setAction('add'); handleSubmit(); }}>
                        Add Course
                    </Button>
                    <Button variant="contained" color="warning" onClick={() => { setAction('update'); handleSubmit(); }}>
                        Update Course
                    </Button>
                    <Button variant="contained" color="error" onClick={() => { setAction('delete'); handleSubmit(); }}>
                        Delete Course
                    </Button>
                </Box>
            </Paper>

            {/* Tables Section */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <StaffCoursesTable courses={courses} />
                </Grid>
                <Grid item xs={12}>
                    <StaffInstructorsTable instructors={instructors} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ManageCoursesPage;
