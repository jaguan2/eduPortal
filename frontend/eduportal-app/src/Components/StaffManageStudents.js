import React, { useState, useEffect } from "react";
import axios from "axios";
import StaffStudentsTable from "./StaffStudentsTable";

const StaffManageStudents = () => {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [major, setMajor] = useState("");
    const [majors, setMajors] = useState([]); // Store majors for the dropdown
    const [action, setAction] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch majors when the component mounts
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/getStaffMajors");
                setMajors(response.data.majors);
            } catch (err) {
                setError("Failed to fetch majors.");
            }
        };
        fetchMajors();
    }, []);

    const handleSubmit = async () => {
        setMessage("");
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:5000/manage_students", {
                action,
                id,
                username,
                password,
                major,
            });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Manage Students</h1>
    
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
    
            <form>
                <div className="mb-3">
                    <label>ID (for Update/Delete)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Major</label>
                    <select
                        className="form-select"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        required
                    >
                        <option value="">Select a Major</option>
                        {majors.map((major) => (
                            <option key={major.id} value={major.id}>
                                {major.majorName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            setAction("add");
                            handleSubmit();
                        }}
                    >
                        Add Student
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => {
                            setAction("update");
                            handleSubmit();
                        }}
                    >
                        Update Student
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                            setAction("delete");
                            handleSubmit();
                        }}
                    >
                        Delete Student
                    </button>
                </div>
            </form>
    
            {/* Students List Table */}
            <div className="mt-5">
                <StaffStudentsTable />
            </div>
        </div>
    );
    
};

export default StaffManageStudents;
