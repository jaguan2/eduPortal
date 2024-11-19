import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const StaffStudentsTable = () => {
    const [students, setStudents] = useState([]);
    const [department, setDepartment] = useState(""); // State for department name
    const [error, setError] = useState("");
    const [showPasswords, setShowPasswords] = useState(false); // State to toggle password visibility

    // Fetch students and department name when the component mounts
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/getStaffStudents");
                setStudents(response.data.students);
            } catch (err) {
                setError("Failed to fetch students.");
            }
        };

        const fetchDepartment = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/getStaffDepartment");
                setDepartment(response.data.department); // Extract department name
            } catch (err) {
                setError("Failed to fetch department name.");
            }
        };

        fetchStudents();
        fetchDepartment();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">
                Students in {department ? `${department} Department` : "Your Department"}
            </h1>
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Toggle Button */}
            <div className="text-end mb-3">
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setShowPasswords((prev) => !prev)}
                >
                    {showPasswords ? "Hide Passwords" : "Show Passwords"}
                </button>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Password</th>
                        <th scope="col">Major</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.username}</td>
                            <td>{showPasswords ? student.password : "******"}</td>
                            <td>{student.major}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffStudentsTable;
