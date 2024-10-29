import React from 'react';
import {
    Paper,
    Button
} from '@mui/material';

const Navigation = () => {

    // api call to get data

    return (
        <div component={Paper}>
            <div>
                <div>UID: </div>
                <div>GPA: </div>
                // handleWhatIfClick temporary function name for "What if" button
                <Button variant="outlined" onClick={(handleWhatIfClick)}>
                    What if?
                </Button>
            </div>
        </div>
    )
}

export default Navigation;