import './App.css';
import CourseTable from './Components/StudentCourseTable';
import StudentNavigation from './Components/StudentNavigation';
import Profile from './Components/Profile';

function App() {
  return (
    <div className="App">
      <Profile/>
      <StudentNavigation/>
    </div>
  );
}

export default App;
