import React from 'react';

const Navigation = () => {
    const handleWhatIfClick = () => {
        console.log("What if button clicked");
    };

    return (
        <div style={{ padding: '1rem', border: '1px solid #ddd', margin: '1rem 0' }}>
            <div style={{ marginBottom: '0.5rem' }}>
                <strong>UID:</strong> [User ID]
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
                <strong>GPA:</strong> [GPA Value]
            </div>
            <button onClick={handleWhatIfClick} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                What if?
            </button>
        </div>
    );
};

export default Navigation;
