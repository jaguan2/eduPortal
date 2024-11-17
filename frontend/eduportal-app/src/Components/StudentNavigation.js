import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './StudentNavigation.css';
import {Link, useNavigate} from 'react-router-dom';

const StudentNavigation = () => {
    // api call to get data
    const [UID, setUID] = useState(''); // State for the UID
    const [GPA, setGPA] = useState(''); // State for the GPA
    const [error, setError] = useState(''); // State for handling errors
    const navigate = useNavigate();

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

    const handleClick = () => {
        navigate("/WhatIfPage")
    }

    return (
        <div className="NavigationBox container px-4">
            <div className="row">
                <div className="Info col">
                    <div className="InfoLabel item">UID:</div>
                    <div className="InfoData item">{UID}</div>
                </div>
                <div className="Info col">
                    <div className="InfoLabel item">GPA:</div>
                    <div className="InfoData item">{GPA}</div>
                </div>
                <button type="button" className="col btn btn-primary custom-sizing" onClick={handleClick}>
                    What if?
                </button>
            </div>
        </div>
    )
}

export default StudentNavigation;