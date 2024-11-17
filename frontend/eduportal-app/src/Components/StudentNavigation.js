import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './StudentNavigation.css';

const StudentNavigation = () => {
    // api call to get data
    const [UID, setUID] = useState(''); // State for the UID
    const [GPA, setGPA] = useState(''); // State for the GPA
    const [error, setError] = useState(''); // State for handling errors

    // Use an API call to fetch the user's uid and gpa
    useEffect(() => {
        // Simulating an API call
        const fetchUID = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getID');
                console.log(response.data)
                setUID(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchUID();

        const fetchGPA = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getGPA');
                console.log(response.data)
                setGPA(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchGPA();

    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="NavigationBox">
            <div className="Info">
                <div className="InfoLabel item">UID:</div>
                <div className="InfoData item">{UID}</div>
            </div>
            <div className="Info">
                <div className="InfoLabel item">GPA:</div>
                <div className="InfoData item">{GPA}</div>
            </div>
            <button>
                What if?
            </button>
        </div>
    )
}

export default StudentNavigation;