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
        <div className="ProfileContainer container">
            <div className="row">
                {/* Profile Image - Takes up 5 columns on large screens, 12 columns on small screens */}
                <div className="ProfileImage col-12 col-md-5">
                    <img className="img-fluid" src={UserProfilePicture} alt="Profile" />
                </div>
                {/* User Name - Takes up 7 columns on large screens, 12 columns on small screens */}
                <div className="UserName col-12 col-md-7 d-flex align-items-center">
                    {error ? (
                        <div style={{ color: 'red' }}>
                            {error} {/* Show error if there's an issue */}
                        </div>
                    ) : (
                        <h2 className="Name">{name || 'Loading...'}</h2> // Show loading text if name is not yet fetched
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;