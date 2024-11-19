import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import { 
    Container, 
    Form, 
    Button, 
    Alert 
} from 'react-bootstrap';

function LoginPage({ setIsLoggedIn, setUserRole }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent form submission reload
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                username,
                password,
                role,
            });

            if (response.status === 200) {
                console.log('Login successful:', response.data);
                
                setIsLoggedIn(true);

                setUserRole(role);

                navigate(`/${role}Dashboard`);
            } else if (response.status === 401){
                console.error('Invalid credentials failed:', response.data.error);
                setError(response.data.error);
            } else if (response.status === 404){
                console.error('User not found', response.data.error);
                setError(response.data.error);
            }
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            setError(err.response?.data || 'help');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h1 className="text-center mb-4">EduPortal</h1>
            <Form onSubmit={handleLogin}>
                {/* Username Input */}
                <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Password Input */}
                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Role Selection */}
                <Form.Group controlId="role" className="mb-3">
                    <Form.Label>Select Role</Form.Label>
                    <Form.Select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Choose...</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="advisor">Advisor</option>
                        <option value="admin">System Administrator</option>
                        <option value="staff">Staff</option>
                    </Form.Select>
                </Form.Group>

                {/* Error Message */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Submit Button */}
                <Button type="submit" className="w-100" variant="primary">
                    Sign In
                </Button>
            </Form>
        </Container>
    );
}

export default LoginPage;