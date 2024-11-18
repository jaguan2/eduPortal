import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Import Axios
import './InstructorCourseTable.css'

const CourseTable = ({ semester, year, onSelectCourses }) => {
    // api call to get data
    const [rows, setRows] = useState([]);
    // const [selectedCourse, setSelectedCourse] = null([]);
    const [showNewTable, setShowNewTable] = useState(false);
    const [courseStudents, setCourseStudents] = useState([]);
    const [loading, setLoading] = useState(false);
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

    const handleShowNewTable = async (courseId) => {
        setLoading(true);
        setShowNewTable(true);
        setCourseStudents([]);
        try {
            const response = await axios.post('http://127.0.0.1:5000/getCourseStudents', {id: courseId});

            if (response.data && response.data.length > 0) {
                setCourseStudents(response.data);
            } else {
                setCourseStudents([]);
            }
        } catch (error) {
            console.error('Erorr fetching data', error);
            setCourseStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToTable = () => {
        setShowNewTable(false);
    }

    return (
        <div>
            {
                showNewTable ? (
                    <div>
                        <table className="table table-striped container">
                        <thead>
                            <tr>
                                <th scope="col">Student ID</th>
                                <th scope="col">Student Name</th>
                                <th scope="col">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseStudents.map((data, index) => (
                                <tr key={index}>
                                    <td scope="row">{data.id}</td>
                                    <td scope="row">{data.name}</td>
                                    <td scope="row">{data.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                        <button onClick={handleBackToTable}>Back</button>
                    </div>
                ) : (
                    <div>
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
                                        <button
                                            onClick={() => handleShowNewTable(data.courseid)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                )
            }
        </div>

    )
}

export default CourseTable;