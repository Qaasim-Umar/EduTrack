import "./App.css";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import Home from "./pages/Home";
import TeacherLogin from "./pages/UserLogin";
import SuperSignUp from "./pages/SuperSignUp";
import SuperDashboard from "./pages/Dashboard/SuperDashboard";
import SuperLogin from "./pages/SuperLogin";
import CreateUser from "./pages/CreateUser";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import ResultList from "./pages/Dashboard/results/ResultList";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CreateUser" element={<CreateUser />} />
          <Route path="/TeacherLogin" element={<TeacherLogin />} />
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
          <Route path="/SuperSignUp" element={<SuperSignUp />} />
          <Route path="/SuperDashboard" element={<SuperDashboard />} />
          <Route path="/SuperLogin" element={<SuperLogin />} />
          <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
          <Route path="/ResultList" element={<ResultList />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
