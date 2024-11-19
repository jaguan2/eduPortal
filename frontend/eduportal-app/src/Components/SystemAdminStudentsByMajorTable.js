import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ListStudentsByMajorTable = () => {
    const [studentsByMajor, setStudentsByMajor] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudentsByMajor = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/getListStudentsByMajor");
                setStudentsByMajor(response.data);
            } catch (err) {
                setError("Failed to fetch students by major.");
            }
        };

        fetchStudentsByMajor();
    }, []);

    if (error) {
        return <div className="container mt-5 alert alert-danger">{error}</div>;
    }

    if (!studentsByMajor.length) {
        return <div className="container mt-5 text-center">Loading...</div>; // Handle loading state
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Students by Major</h1>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Major</th>
                        <th scope="col">Student ID</th>
                        <th scope="col">Student Name</th>
                        <th scope="col">Total Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {studentsByMajor.map((student, index) => (
                        <tr key={index}>
                            <td>{student.major_name}</td>
                            <td>{student.student_id}</td>
                            <td>{student.student_name}</td>
                            <td>{student.total_credits}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListStudentsByMajorTable;
