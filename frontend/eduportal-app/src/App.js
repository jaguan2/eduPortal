import './App.css';
<<<<<<< HEAD
import StudentDashboard from './Components/StudentDashboard';
=======
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CourseTable from './Components/StudentCourseTable';
import StudentNavigation from './Components/StudentNavigation';
import Profile from './Components/Profile';

import LoginPage from './Routes/LoginPage';
>>>>>>> 69698abd4812ce3e7959d0c59cb9067c56818a69
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
<<<<<<< HEAD
    <div className="App">
      <StudentDashboard/>
    </div>
=======
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
>>>>>>> 69698abd4812ce3e7959d0c59cb9067c56818a69
  );
}

export default App;