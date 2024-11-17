import React, { useState } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import "./WhatIfNCoursesForm.css";

const WhatifNCoursesForm = () => {
    const [rows, setRows] = useState([
        {course: '', credits: '', grade: ''},
        {course: '', credits: '', grade: ''},
        {course: '', credits: '', grade: ''}
    ]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const gradeMapping = {
        A: 4,
        B: 3,
        C: 2,
        D: 1,
        F: 0,
    };

    const validateForm = () => {
        for (let i = 0; i < rows.length; i++) {
            const {course, credits, grade} = rows[i];

            if (
                (course && !credits) || (course && !grade) ||
                (credits && !course) || (credits && !grade) ||
                (grade && !course) || (grade && !credits)
            ) {return false;}

            return true;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!validateForm()) {
            alert("Please fill all fields for attempted rows.");
            setLoading(false)
            console.log("Error")
            return;
        }

        const formData = rows.map((row) => ({
            course: row.course,
            credits: parseInt(row.credits, 10),
            grade:row.grade
        }));

        try {
            console.log(formData);
            const response = await axios.post('http://127.0.0.1:5000/whatIfNCourses', formData);   
            setResult(response.data)
        } catch (err) {
            setError('An error occurred');
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRowChange = (index, e) => {
        const {name, value} = e.target;
        const newRows = [...rows];

        if (name === "grade"){
            newRows[index][name] = gradeMapping[value];
        } else {
            newRows[index][name] = value;
        }

        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, {courseName: '', credits: '', grade: ''}]);
    };

    return (
        <div className="WhatIfContainer container-fluid align-items-center">
            <h2 className="mb-5 text-center">Calculate Course</h2>
            <Form onSubmit={handleSubmit}>
                <div className="container-fluid text-center">
                    {rows.map((row, index) => (
                        <div>
                            <div class="row" key={index} className="row align-items-center">
                                <div class="col" sm={4}>
                                    <Form.Control 
                                        className="form-input"
                                        type="text"
                                        name="course"
                                        value={row.course}
                                        placeholder="Course"
                                        onChange={(e) => handleRowChange(index, e)}
                                    />
                                </div>

                                <div class="col" sm={4}>
                                    <Form.Control 
                                        className="form-input"
                                        type="number"
                                        name="credits"
                                        value={row.credits}
                                        placeholder="Credits"
                                        onChange={(e) => handleRowChange(index, e)}
                                    />
                                </div>

                                <div class="col" sm={4}>
                                    <Form.Select
                                        className="form-input"
                                        name="grade"
                                        value={Object.keys(gradeMapping).find(
                                            (key) => gradeMapping[key] === row.grade
                                        ) || ""}
                                        onChange={(e) => handleRowChange(index, e)}
                                    >
                                        <option value="">Select Grade</option>
                                        <option value='A'>A</option>
                                        <option value='B'>B</option>
                                        <option value='C'>C</option>
                                        <option value='D'>D</option>
                                        <option value='F'>F</option>
                                    </Form.Select>
                                </div>
                            </div>    
                        </div>
                    ))} 
                </div>
                
                <div className = "buttons">
                    <button class="btn-primary" type="button" onClick={handleAddRow}>
                        +
                    </button>

                    <button class="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Calculating...' : 'Calculate'}
                    </button>
                </div>
            </Form>

            {result && (
                <div variant="success" className="results mt-3">
                    <h4>New GPA: {result}</h4>
                </div>
            )}

        </div>
    );
}

export default WhatifNCoursesForm;