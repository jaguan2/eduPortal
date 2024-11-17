import React, { useState } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import "./WhatIfNCoursesForm.css";

const WhatIfDesiredGPA = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null)
        setError(null);

        if (isNaN(input) || input === '') {
            setError('Please enter a valid number.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/whatIfDesiredGPA', {number: input});   
            setResult(response.data);
        } catch (err) {
            setError('An error occurred');
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="WhatIfContainer container-fluid align-items-center">
            <h2 className="mb-5 text-center">Desired GPA Calculator</h2>
            <form onSubmit={handleSubmit}>
                <div className="Form Group">
                    <label htmlFor="input">Desired GPA: </label>
                    <input
                        id="input"
                        type="number"
                        step="0.01"
                        value={input}
                        onChange={handleInputChange}
                        placeholder=""
                    />
                </div>
                
                <div className = "buttons">
                    <button class="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Calculating...' : 'Calculate'}
                    </button>
                </div>
            </form>

            {result && (
                <div>
                    {result.map((str, index) => (
                        <p key={index}>{str}</p>
                    ))}
                </div>
            )}

        </div>
    );
}

export default WhatIfDesiredGPA;