import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffAdvisorsTable = () => {
    const [advisors, setAdvisors] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/getStaffAdvisors');
                setAdvisors(response.data);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('Failed to fetch advisors. Please try again.');
                }
            }
        };

        fetchAdvisors();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Advisors</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th scope="col">Advisor ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Department</th>
                    </tr>
                </thead>
                <tbody>
                    {advisors.map((advisor) => (
                        <tr key={advisor.id}>
                            <td>{advisor.id}</td>
                            <td>{advisor.username}</td>
                            <td>{advisor.department}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffAdvisorsTable;
