import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './AdvisorTable.css';

const AdvisorTable = () => {
    // api call to get data
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(''); // State for handling errors

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/advisorStudentList');
                console.log(response.data)
                setRows(response.data);  // Set the list of students
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An unexpected error occurred!');
                }
            }
        };
    
        fetchStudents();
    }, []);  // Runs only once on component mount
    

    return (
        <table className="table table-striped container">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Major</th>
                    <th scope="col">Add</th>
                    <th scope="col">Drop</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((data, index) => (
                    <tr>
                        <td scope="row">{data.id}</td>
                        <td scope="row">{data.username}</td>
                        <td scope="row">{data.major}</td>
                        <td scope="row">
                            <button type="button" className="col btn btn-primary custom-sizing">
                                +
                            </button>
                        </td>
                        <td scope="row">
                            <button type="button" className="col btn btn-primary custom-sizing">
                                -
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default AdvisorTable;