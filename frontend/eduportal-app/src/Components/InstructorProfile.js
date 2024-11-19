import React, { useState, useEffect } from 'react';
import UserProfilePicture from '../Images/UserProfilePicture.png';
import axios from 'axios'; // Import Axios
import './InstructorProfile.css';

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
                const response = await axios.get('http://127.0.0.1:5000/getInstructorName');
                console.log(response.data); // Log to confirm structure
                setName(response.data.username); // Set only the "username" field
            } catch (error) {
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    setError(error.response.data.error);
                } else {
                    console.error('Error:', error.message);
                    setError('An unexpected error occurred!');
                }
            }
        };
        

        fetchName();
    }, []); // Empty dependency array ensures this runs only once
    
    return (
        <div className="ProfileContainer container">
            <div className="col Profile d-flex align-items-center">
                <div className="ProfileImage col-4">
                    <img className="img-fluid" src={UserProfilePicture} alt="Profile" />
                </div>
                <div className="UserName col-3 d-flex align-items-center">
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