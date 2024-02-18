import './App.css';
import Register from './components/register';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from './components/login';
import Student from './components/students/student';
import Admin from './components/admin';
import EditStudent from './components/students/editStudent';
import CreateStudent from './components/students/createStudent';
import CreateQuestion from './components/questions/createQuestion';
import Questions from './components/questions/questions';
import EditQuestion from './components/questions/editQuestion';
import Exams from './components/exams/exams';
import CreateExams from './components/exams/createExams';
import EditExams from './components/exams/editExams';
import QuestionExams from './components/exams/questionExams';
import StudentPersonalDashbobard from './components/students/studentPersonalDashboard';
import AssignExam from './components/exams/assignExam';
import StudentExamDetails from './components/admin/studentExamDetails';
import StudentPersonalExamInfo from './components/students/studentPersonalExamInfo';
import StartExam from './components/exams/startExam';
import DisplayQuestions from './components/exams/displayQuestion';
import AuthorizationAlert from './components/authorizationAlert';
import StudentExamSummary from './components/admin/studentExamSummary';

function App() {
  return (
    <div className="App">
      {/* <Register/> */}
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/student" element={<Student />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/exams" element={<Exams></Exams>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/authorization-alert" element={<AuthorizationAlert></AuthorizationAlert>}></Route>

        <Route path="/create-student" element={<CreateStudent></CreateStudent>}></Route>
        <Route path="/create-question" element={<CreateQuestion></CreateQuestion>}></Route>
        <Route path="/create-exam" element={<CreateExams></CreateExams>}></Route>

        <Route path="/edit-student" element={<EditStudent></EditStudent>}></Route>
        <Route path="/edit-question" element={<EditQuestion></EditQuestion>}></Route>
        <Route path="/edit-exam" element={<EditExams></EditExams>}></Route>

        <Route path="/question-exams" element={<QuestionExams></QuestionExams>}></Route>
        <Route path="/assign-exam" element={<AssignExam></AssignExam>}></Route>
        <Route path="/start-exam" element={<StartExam></StartExam>}></Route>
        <Route path="/display-questions" element={<DisplayQuestions></DisplayQuestions>}></Route>
 
        <Route path="/student-personal-dashboard" element={<StudentPersonalDashbobard></StudentPersonalDashbobard>}></Route>
        <Route path="/student-exam-details" element={<StudentExamDetails></StudentExamDetails>}></Route>
        <Route path="/student-personal-exam-info" element={<StudentPersonalExamInfo></StudentPersonalExamInfo>}></Route>
        <Route path="/student-exam-summary" element={<StudentExamSummary></StudentExamSummary>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
