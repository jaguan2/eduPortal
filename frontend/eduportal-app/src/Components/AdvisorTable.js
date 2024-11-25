import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './AdvisorTable.css';

const AdvisorTable = () => {
    const [advisorRows, setAdvisorRows] = useState([]);
    const [addRows, setAddRows] = useState([]);
    const [dropRows, setDropRows] = useState([]);
    const [currentTable, setCurrentTable] = useState('advisor');
    const [currentStudentId, setCurrentStudentId] = useState(null);
    const [error, setError] = useState('');
    const [selectedRows, setSelectedRows] = useState([]); // Track selected rows for add/drop actions

    // Fetch advisor table data
    const fetchAdvisorData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/advisorStudentList');
            setAdvisorRows(response.data);
        } catch (error) {
            setError(error.response?.data?.error || 'An unexpected error occurred!');
        }
    };

    useEffect(() => {
        fetchAdvisorData();
    }, []);

    // Fetch add table data
    const fetchAddData = async (studentId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/addClass/${studentId}`);
            setAddRows(response.data);
        } catch (error) {
            setError(error.response?.data?.error || 'An unexpected error occurred!');
        }
    };

    // Fetch drop table data
    const fetchDropData = async (studentId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/dropClass/${studentId}`);
            setDropRows(response.data);
        } catch (error) {
            setError(error.response?.data?.error || 'An unexpected error occurred!');
        }
    };

    // Handle adding selected courses
    const handleAddSelectedCourses = async () => {
        if (!currentStudentId) {
            setError("No student selected for adding courses.");
            return;
        }
    
        try {
            await axios.post(`http://127.0.0.1:5000/addClass`, {
                studentId: currentStudentId, // Ensure this is a number or string
                courseIds: selectedRows, // Valid array of course IDs
            });
            fetchAddData(currentStudentId); // Refresh the add table data
            setError('Courses added successfully!');
            setSelectedRows([]); // Reset selected rows
        } catch (error) {
            setError(`Error adding courses: ${error.response?.data?.error || error.message}`);
        }
    };
    

    // Handle dropping selected courses
    const handleDropSelectedCourses = async (studentId) => {
        try {
            await axios.post(`http://127.0.0.1:5000/dropClass/${studentId}`, {
                studentId: currentStudentId,
                courseIds: selectedRows,
            });
            fetchDropData(currentStudentId); // Refresh the table
            setError('Courses dropped successfully!');
        } catch (error) {
            setError(error.response?.data?.error || 'An unexpected error occurred!');
        }
    };

    // Handle selecting or deselecting a row
    const toggleRowSelection = (courseId) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(courseId)
                ? prevSelected.filter((id) => id !== courseId)
                : [...prevSelected, courseId]
        );
    };

    // Handle showing the add table
    const handleAddClick = (studentId) => {
        setSelectedRows([]); // Reset selected rows
        fetchAddData(studentId);
        setCurrentStudentId(studentId);
        setCurrentTable('add');
    };

    // Handle showing the drop table
    const handleDropClick = (studentId) => {
        setSelectedRows([]); // Reset selected rows
        fetchDropData(studentId);
        setCurrentStudentId(studentId);
        setCurrentTable('drop');
    };

    return (
        <div className="container">
            {/* Error message */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Render the appropriate table based on currentTable */}
            {currentTable === 'advisor' ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Major</th>
                            <th>Add</th>
                            <th>Drop</th>
                        </tr>
                    </thead>
                    <tbody>
                        {advisorRows.map((data) => (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.username}</td>
                                <td>{data.major}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAddClick(data.id)}
                                    >
                                        +
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDropClick(data.id)}
                                    >
                                        -
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setSelectedRows(
                                                e.target.checked
                                                    ? currentTable === 'add'
                                                        ? addRows.map((row) => row.courseId)
                                                        : dropRows.map((row) => row.courseId)
                                                    : []
                                            )
                                        }
                                    />
                                </th>
                                <th>Course</th>
                                <th>Semester</th>
                                <th>Year</th>
                                {currentTable === 'add' ? <th>Credits</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {(currentTable === 'add' ? addRows : dropRows).map((data) => (
                                <tr key={data.courseId}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={() => toggleRowSelection(data.courseId)}
                                            checked={selectedRows.includes(data.courseId)}
                                        />
                                    </td>
                                    <td>{data.courseName}</td>
                                    <td>{data.semester}</td>
                                    <td>{data.year}</td>
                                    {currentTable === 'add' ? <td>{data.credits}</td> : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        className={`btn ${
                            currentTable === 'add' ? 'btn-success' : 'btn-danger'
                        }`}
                        onClick={
                            currentTable === 'add'
                                ? handleAddSelectedCourses
                                : handleDropSelectedCourses
                        }
                        disabled={selectedRows.length === 0}
                    >
                        {currentTable === 'add' ? 'Add Selected Courses' : 'Drop Selected Courses'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdvisorTable;
