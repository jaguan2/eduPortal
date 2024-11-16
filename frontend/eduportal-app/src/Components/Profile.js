import React, { useState, useEffect } from 'react';
import { Paper, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import PFP from '../Images/PFP.jpg';
import axios from 'axios'; // Import Axios

// this component represents the area displaying the user's Icon and Name
const Profile = () => {
    // api call to get data
    const [name, setName] = useState(''); // State for the name
    const [error, setError] = useState(''); // State for handling errors
    const theme = createTheme();

    // Use an API call to fetch the user's name
    useEffect(() => {
        // Simulating an API call
        const fetchName = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getID');
                console.log(response.data)
                setName(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchName();
    }, []); // Empty dependency array ensures this runs only once
    
    return (
        <div>
            <img
                src={PFP}
                alt="Profile"
            />
            {error ? (
                <div style={{ color: 'red' }}>{error}</div> // Show error if there's an issue
            ) : (
                <h2>{name || 'Loading...'}</h2> // Show loading text if name is not yet fetched
            )}
        </div>
    )
}

export default Profile;