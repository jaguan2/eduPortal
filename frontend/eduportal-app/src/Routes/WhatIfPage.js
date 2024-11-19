// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from "react-router-dom"; 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import WhatifNCoursesForm from '../Components/WhatIfNCoursesForm';
// import WhatIfDesiredGPA from '../Components/WhatIfDesiredCalc';
// import "./WhatIfPage.css"

// function WhatIfPage({}) {
//     const [selectedButton, setSelectedButton] = useState('button1');

//     const handleClick = (button) => {
//         setSelectedButton(button);
//     };

//     return (
//         <div className="WhatIfPage row">
//             <div className="WhatIfNavigation col-12 col-sm-5 col-md-5 mb-4">
//                 <button 
//                     className={`toggle-button ${selectedButton === 'button1' ? 'active' : ''}`}
//                     onClick={() => handleClick('button1')}>
//                     What if N Courses
//                 </button>

//                 <button 
//                     className={`toggle-button ${selectedButton === 'button2' ? 'active' : ''}`}
//                     onClick={() => handleClick('button2')}>
//                     Desired GPA
//                 </button>
//             </div>

//             <div className="WhatIfCalculator col-12 col-sm-5 col-md-5 mb-4">
//                 {selectedButton === 'button1' && <WhatifNCoursesForm />}
//                 {selectedButton === 'button2' && <WhatIfDesiredGPA />}
//             </div>
//         </div>
//     );
// }

// export default WhatIfPage;

import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import WhatifNCoursesForm from '../Components/WhatIfNCoursesForm';
import WhatIfDesiredGPA from '../Components/WhatIfDesiredCalc';

function WhatIfPage() {
    const [selectedButton, setSelectedButton] = useState('button1');

    const handleClick = (button) => {
        setSelectedButton(button);
    };

    return (
        <Grid container spacing={2} justifyContent="center" style={{ padding: '2rem' }}>
            {/* Navigation Section */}
            <Grid item xs={12} sm={4}>
                <Paper elevation={3} style={{ padding: '1rem', textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Navigation
                    </Typography>
                    <Button
                        variant={selectedButton === 'button1' ? 'contained' : 'outlined'}
                        color="primary"
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                        onClick={() => handleClick('button1')}
                    >
                        What if N Courses
                    </Button>
                    <Button
                        variant={selectedButton === 'button2' ? 'contained' : 'outlined'}
                        color="primary"
                        fullWidth
                        onClick={() => handleClick('button2')}
                    >
                        Desired GPA
                    </Button>
                </Paper>
            </Grid>

            {/* Calculator Section */}
            <Grid item xs={12} sm={6}>
                <Paper elevation={3} style={{ padding: '1rem' }}>
                    {selectedButton === 'button1' && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                What if N Courses
                            </Typography>
                            <WhatifNCoursesForm />
                        </Box>
                    )}
                    {selectedButton === 'button2' && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Desired GPA
                            </Typography>
                            <WhatIfDesiredGPA />
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default WhatIfPage;
