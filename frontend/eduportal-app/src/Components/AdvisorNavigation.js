import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdvisorNavigation.css';

const AdvisorNavigation = () => {
    // State for advisor-specific info
    const [UID, setUID] = useState(''); // State for the UID
    const [department, setDepartment] = useState(''); // State for the department
    const [error, setError] = useState(''); // State for handling errors

    // Use an API call to fetch the advisor's UID, department, and office
    useEffect(() => {
        const fetchUID = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getID');
                console.log(response.data);
                setUID(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        // Call the fetchUID function
        fetchUID();
    }, []); // Empty dependency array ensures this runs only once


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

    return (
        <div className="NavigationBox container px-4">
            <div className="row">
                <div className="Info col">
                    <div className="InfoLabel item">UID:</div>
                    <div className="InfoData item">{UID || 'Loading...'}</div>
                </div>
                <div className="Info col">
                    <div className="InfoLabel item">Department:</div>
                    <div className="InfoData item">{department || 'Loading...'}</div>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default AdvisorNavigation;
