import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const InstructorStudentsByMajorTable = () => {
    const [data, setData] = useState([]); // State to store fetched data
    const [error, setError] = useState(""); // State for error handling

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/getSystemAdminInstructorStudentByMajor");
                setData(response.data); // Update the state with fetched data
            } catch (err) {
                setError("Failed to fetch data.");
            }
        };

        fetchData(); // Fetch data when the component mounts
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Instructor Students by Major</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Instructor ID</th>
                        <th scope="col">Instructor Name</th>
                        <th scope="col">Major</th>
                        <th scope="col">Total Students</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.instructor_id}</td>
                            <td>{item.instructor_name}</td>
                            <td>{item.major_name}</td>
                            <td>{item.total_students}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InstructorStudentsByMajorTable;
