// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios'; // Import Axios
// import './InstructorCourseTable.css'

const CourseTable = ({ semester, year, onSelectCourses }) => {
    // api call to get data
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(''); // State for handling errors

    useEffect(() => {
        const fetchRows = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/InstructorCourses');
                console.log(response.data)
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

    // Filer rows based on semester and year
    const filteredRows = rows.filter(row => {
        return (
            (!semester || row.semester.toLowerCase() === semester.toLowerCase()) &&
            (!parseInt(year) || parseInt(row.year) === parseInt(year))
        );
    });

    return (
        <table className="table table-striped container">
            <thead>
                <tr>
                    <th scope="col">Course ID</th>
                    <th scope="col">Course</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Year</th>
                    <th scope="col">Select</th>
                </tr>
            </thead>
            <tbody>
                {filteredRows.map((data, index) => (
                    <tr key={index}>
                        <td scope="row">{data.courseid}</td>
                        <td scope="row">{data.course}</td>
                        <td scope="row">{data.semester}</td>
                        <td scope="row">{data.year}</td>
                        <td scope="row">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={() => onSelectCourses(data.id)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

// export default CourseTable;