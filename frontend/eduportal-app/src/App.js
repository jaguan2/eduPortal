import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CourseTable from './Components/StudentCourseTable';
import StudentNavigation from './Components/StudentNavigation';
import Profile from './Components/Profile';

import LoginPage from './Routes/LoginPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        
        {/* Route for the student dashboard */}
        <Route
          path="/studentDashboard"
          element={isLoggedIn ? <StudentNavigation /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
