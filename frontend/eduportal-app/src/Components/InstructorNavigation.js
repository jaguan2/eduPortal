import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './InstructorNavigation.css';

const InstructorNavigation = () => {
    // api call to get data
    const [UID, setUID] = useState(''); // State for the UID
    const [department, setDepartment] = useState(''); // State for the GPA
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

        const fetchDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getDepartment');
                console.log(response.data)
                setDepartment(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchDepartment();

    }, []); // Empty dependency array ensures this runs only once

    return (
        <div className="NavigationBox">
            <div className="Info">
                <div className="InfoLabel">UID:</div>
                <div className="InfoData">{UID}</div>
            </div>
            <div className="Info">
                <div className="InfoLabel">Department:</div>
                <div className="InfoData">{department}</div>
            </div>
        </div>
    )
}

export default InstructorNavigation;