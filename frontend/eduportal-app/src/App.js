import './App.css';
import StudentDashboard from './Routes/StudentDashboard';
import InstructorDashboard from './Components/InstructorDashboard';
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './Routes/LoginPage';
import StudentDashboard from './Routes/StudentDashboard';
import WhatIfPage from './Routes/WhatIfPage';
import InstructorDashboard from './Routes/InstructorDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole}/>} />
        
        {/* Route for the student dashboard */}
        <Route
          path="/studentDashboard"
          element={isLoggedIn ? <StudentDashboard /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/instructorDashboard"
          element={isLoggedIn ? <InstructorDashboard/> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route 
          path="/WhatIfPage"
          element={<WhatIfPage />}
        />

      </Routes>
    </Router>
    // <div className="App">
    //   <InstructorDashboard/>
    //   {/* <StudentDashboard/> */}
    // </div>
  );
}

export default App;