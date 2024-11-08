import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Login from './components/LoginPage';
import StudentDashboard from './components/Dashboard/StudentDashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Box sx={{ textAlign: 'center', padding: '1rem', borderBottom: '1px solid #ddd' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to the App
                </Typography>
            </Box>
            {isLoggedIn ? (
                <StudentDashboard />
            ) : (
                <Login onLogin={() => setIsLoggedIn(true)} /> // Pass onLogin prop to handle login
            )}
        </Container>
    );
}

export default App;
