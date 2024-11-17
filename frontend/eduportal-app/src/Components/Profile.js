import React, { useState, useEffect } from 'react';
import UserProfilePicture from '../Images/UserProfilePicture.png';
import axios from 'axios'; // Import Axios
import './Profile.css';

// this component represents the area displaying the user's Icon and Name
const Profile = () => {
    // api call to get data
    const [name, setName] = useState(''); // State for the name
    const [error, setError] = useState(''); // State for handling errors

    // Use an API call to fetch the user's name
    useEffect(() => {
        // Simulating an API call
        const fetchName = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getName');
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
        <div className="ProfileContainer">
            <img className="Icon"
                src={UserProfilePicture}
                alt="Profile"
            />
            {error ? (
                <div style={{ color: 'red' }}>{error}</div> // Show error if there's an issue
            ) : (
                <h2 className="Name">{name || 'Loading...'}</h2> // Show loading text if name is not yet fetched
            )}
        </div>
    )
}

export default Profile;