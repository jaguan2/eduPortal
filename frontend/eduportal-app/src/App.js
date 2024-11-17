import './App.css';
import StudentDashboard from './Routes/StudentDashboard';
// import StaffDashboard from './Routes/StaffDashboard'
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LoginPage from './Routes/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';

import WhatIfPage from './Routes/WhatIfPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    // <Router>
    //   <Routes>
    //     {/* Route for the login page */}
    //     <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        
    //     {/* Route for the student dashboard */}
    //     <Route
    //       path="/studentDashboard"
    //       element={isLoggedIn ? <StudentDashboard /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
    //     />
    //   </Routes>
    // </Router>
    <div className="App">
      <StudentDashboard/>
    </div>
  );
}

export default App;