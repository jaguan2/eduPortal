import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SystemAdminGPAStatisticsTable.css'

const SystemAdminGPAStatisticsTable = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/admin_gpa_statistics');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError('Failed to fetch GPA statistics.');
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">GPA Statistics by Major</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Major</th>
                        <th>Highest GPA</th>
                        <th>Lowest GPA</th>
                        <th>Average GPA</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.major}</td>
                            <td>{item.highest_gpa.toFixed(2)}</td>
                            <td>{item.lowest_gpa.toFixed(2)}</td>
                            <td>{item.average_gpa.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default SystemAdminGPAStatisticsTable;
