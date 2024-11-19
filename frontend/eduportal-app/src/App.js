import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './Routes/Theme/theme2';
import LoginPage from './Routes/LoginPage';
import StudentDashboard from './Routes/StudentDashboard';
import WhatIfPage from './Routes/WhatIfPage';
import InstructorDashboard from './Routes/InstructorDashboard';
import SystemAdminDashboard from './Routes/SystemAdminDashboard';
import StaffDashboard from './Routes/StaffDashboard';
import AdvisorDashboard from './Routes/AdvisorDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      {/* Apply global CSS reset */}
      <CssBaseline />

      {/* React Router for routing */}
      <Router>
        <Routes>
          {/* Route for the login page */}
          <Route 
            path="/" 
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole}/>} 
          />
          
          {/* Route for the student dashboard */}
          <Route
            path="/studentDashboard"
            element={isLoggedIn ? <StudentDashboard /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Route for the instructor dashboard */}
          <Route
            path="/instructorDashboard"
            element={isLoggedIn ? <InstructorDashboard/> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Route for the system admin dashboard */}
          <Route
            path="/adminDashboard"
            element={isLoggedIn ? <SystemAdminDashboard/> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Route for the staff dashboard */}
          <Route
            path="/staffDashboard"
            element={isLoggedIn ? <StaffDashboard/> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Route for the advisor dashboard */}
          <Route
            path="/advisorDashboard"
            element={isLoggedIn ? <AdvisorDashboard/> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* Route for the What-If page */}
          <Route
            path="/WhatIfPage"
            element={<WhatIfPage />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
