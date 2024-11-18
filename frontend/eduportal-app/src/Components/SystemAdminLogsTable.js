import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import Axios
import './SystemAdminLogsTable.css'

const LogsTable = () => {
    // api call to get data
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(''); // State for handling errors

    useEffect(() => {
        const fetchRows = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getSystemLogs');
                setRows(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };

        fetchRows();
    }, []);

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
    
        // Extract local date and time components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        // Format as YYYY-MM-DD and HH:MM:SS
        const dateString = `${year}-${month}-${day}`;
        const timeString = `${hours}:${minutes}:${seconds}`;
    
        return { date: dateString, time: timeString };
    };

    return (
        <table className="table table-striped container">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Action</th>
                    <th scope="col">Details</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((data, index) => {
                    const { date, time } = formatDateTime(data.operation_timestamp);
                    return (
                        <tr key={index}>
                            <td scope="row">{date}</td>
                            <td scope="row">{time}</td>
                            <td scope="row">{data.user_id}</td>
                            <td scope="row">{data.operation_type}</td>
                            <td scope="row">
                                {data.table_name}: {data.affected_data}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

export default LogsTable;