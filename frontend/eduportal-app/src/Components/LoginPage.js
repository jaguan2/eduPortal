import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Login = ({setIsLoggedIn}) => {

    const [userID, setUserID] = useState('');
    const [userPass, setUserPass] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/login', {username, password});
        } catch (error) {
            if (error.response) {
                setError(err.response.data.error);
            } else {
                setError('An unexpected error occurred!');
            }
        }
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit ={handleLogin}>

                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Password:
                        <input 
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </label>
                </div>

                {error && <div style={{color:'red'}}>{error}</div>}

                <button type="submit">Login</button>

            </form>
        </div>
    );

};