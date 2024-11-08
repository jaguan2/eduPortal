import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import StudentDashboard from './Dashboard/StudentDashboard'; // Import the dashboard component

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', { username, password, role });
            if (response.data.success) {
                console.log("Login successful");
                setIsLoggedIn(true);  // Set login status to true after successful login
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            setError("Error connecting to server");
        }
    };

    // Redirect to the StudentDashboard if logged in
    if (isLoggedIn) {
        return <StudentDashboard />; // Render the dashboard when logged in
    }

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '2rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Select Role</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="instructor">Instructor</MenuItem>
                            <MenuItem value="advisor">Advisor</MenuItem>
                            <MenuItem value="admin">System Administrator</MenuItem>
                            <MenuItem value="staff">Staff</MenuItem>
                        </Select>
                    </FormControl>
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
