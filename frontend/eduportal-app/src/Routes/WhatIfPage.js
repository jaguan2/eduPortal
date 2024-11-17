import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import WhatifNCoursesForm from '../Components/WhatIfNCoursesForm';
import WhatIfDesiredGPA from '../Components/WhatIfDesiredCalc';
import "./WhatIfPage.css"

function WhatIfPage({}) {
    const [selectedButton, setSelectedButton] = useState('button1');

    const handleClick = (button) => {
        setSelectedButton(button);
    };

    return (
        <div className="WhatIfPage row">
            <div className="WhatIfNavigation col-12 col-sm-5 col-md-5 mb-4">
                <button 
                    className={`toggle-button ${selectedButton === 'button1' ? 'active' : ''}`}
                    onClick={() => handleClick('button1')}>
                    What if N Courses
                </button>

                <button 
                    className={`toggle-button ${selectedButton === 'button2' ? 'active' : ''}`}
                    onClick={() => handleClick('button2')}>
                    Desired GPA
                </button>
            </div>

            <div className="WhatIfCalculator col-12 col-sm-5 col-md-5 mb-4">
                {selectedButton === 'button1' && <WhatifNCoursesForm />}
                {selectedButton === 'button2' && <WhatIfDesiredGPA />}
            </div>
        </div>
    );
}

export default WhatIfPage;