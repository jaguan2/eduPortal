import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import './StaffNavigation.css';
//thank you grace and kelly
const StaffNavigation = () => {
    // api call to get data
    const [UID, setUID] = useState(''); // State for the UID
    const [department, setDepartment] = useState(''); // State for the GPA
    const [error, setError] = useState(''); // State for handling errors

    // Use an API call to fetch the user's UID and department
    useEffect(() => {
        // const fetchUID = async () => {
        //     try {
        //         const response = await axios.get('http://127.0.0.1:5000/getID');
        //         console.log('UID Response:', response.data);
        //         setUID(response.data.uid); // Access specific key
        //     } catch (error) {
        //         console.error('Error fetching UID:', error);
        //         setError(error.response?.data?.error || 'Failed to fetch UID');
        //     }
        // };

        const fetchUID = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getID');
                if (response.data.uid) {
                    setUID(response.data.uid);
                } else {
                    setError(response.data.error || "Unknown error");
                }
            } catch (error) {
                setError(error.response?.data?.error || "Failed to fetch UID");
            }
        };

        const fetchDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getDepartment');
                console.log('Department Response:', response.data);
                setDepartment(response.data.department); // Access specific key
            } catch (error) {
                console.error('Error fetching Department:', error);
                setError(error.response?.data?.error || 'Failed to fetch Department');
            }
        };

        fetchUID();
        fetchDepartment();
    }, []); // Empty dependency array ensures this runs only once

    // Render UI
    // return (
    //     <div className="NavigationBox">
    //         {error ? (
    //             <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
    //         ) : (
    //             <>
    //                 <div className="Info">
    //                     <div className="InfoLabel">UID:</div>
    //                     <div className="InfoData">{UID || 'Loading...'}</div>
    //                 </div>
    //                 <div className="Info">
    //                     <div className="InfoLabel">Department:</div>
    //                     <div className="InfoData">{department || 'Loading...'}</div>
    //                 </div>
    //             </>
    //         )}
    //     </div>
    // );
    return (
        <div className="NavigationBox">
            {error ? (
                <div style={{ color: 'red', marginBottom: '10px' }}>{String(error)}</div>
            ) : (
                <>
                    <div className="Info">
                        <div className="InfoLabel">UID:</div>
                        <div className="InfoData">{UID || 'Loading...'}</div>
                    </div>
                    <div className="Info">
                        <div className="InfoLabel">Department:</div>
                        <div className="InfoData">{department || 'Loading...'}</div>
                    </div>
                </>
            )}
        </div>
    );

};

export default StaffNavigation;