import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfile from './UserProfile';
import StudentInfoBar from './StudentInfoBar';
import StudentCourseTable from '../StudentCourseTable';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

function StudentDashboard() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const studentId = "1";

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                
                // Fetch student info
                const studentResponse = await axios.get('http://127.0.0.1:5000/api/student-info');
                setStudentInfo(studentResponse.data);

                // Fetch student courses
                const coursesResponse = await axios.get('http://127.0.0.1:5000/api/student-courses');
                setCourses(coursesResponse.data);

                setLoading(false);
            } catch (err) {
                setError('Failed to load student data.');
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                {/* Profile Section */}
                {studentInfo && <UserProfile name={studentInfo.name} />}

                {/* Info Bar */}
                {studentInfo && (
                    <StudentInfoBar
                        studentId={studentInfo.id}
                        gpa={studentInfo.gpa}
                        onWhatIfClick={() => alert("What-if button clicked!")}
                    />
                )}
            </Box>

            {/* Course Table Section */}
            <StudentCourseTable data={courses} />
        </Container>
    );
}

export default StudentDashboard;
