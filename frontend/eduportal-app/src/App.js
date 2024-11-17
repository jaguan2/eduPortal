import './App.css';
import CourseTable from './Components/StudentCourseTable';
import StudentNavigation from './Components/StudentNavigation';
import Profile from './Components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Profile/>
      <StudentNavigation/>
      <CourseTable/>
    </div>
  );
}

export default App;
