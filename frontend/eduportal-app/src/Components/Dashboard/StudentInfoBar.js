import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function StudentInfoBar({ studentId, gpa, onWhatIfClick }) {
    return (
        <Paper elevation={3} sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1"><strong>Student ID:</strong> {studentId}</Typography>
            <Typography variant="body1"><strong>GPA:</strong> {gpa.toFixed(2)}</Typography>
            <Button variant="contained" color="primary" onClick={onWhatIfClick}>
                What-if?
            </Button>
        </Paper>
    );
}

export default StudentInfoBar;
