import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AboutUs from "./AboutUs/AboutUs";
import "./App.css";
import SubjectPage from "./SubjectPage/SubjectPage";
import NavBar from "../components/NavBar/NavBar";
import LoginPage from "./LoginPage/LoginPage";
import QuizListPage from "./QuizListPage/QuizListPage";
import QuizPage from "./QuizPage/QuizPage";
import NotFoundPage from "./NotFoundPage/NotFoundPage";
import EditQuizPage from "./EditQuizPage/EditQuizPage";
import AdminPage from "./AdminPage/AdminPage";
import SettingPage from "./SettingPage/Setting";
import SmokeTrail from "../components/Effect/SmokeTrail";
import ReviewQuizPage from "./ReviewQuizPage/ReviewQuizPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import UserPage from "./UserPage/UserPage";
import LoginPage_ReduxTest from "./LoginPage/LoginPage";
import SubjectPermissionHandler from "../routes/SubjectPermissionHandler";
import ContributedQuizPage from "./ContributedQuizPage/ContributedQuizPage";
import AdminReviewContributed from "./AdminReviewContributed/AdminReviewContributed";
import RegisterPage from "../pages/LoginPage/RegisterPage";
import ForgotPassPage from "../pages/LoginPage/ForgotPassPage";



function App() {
  const [selected, setSelected] = useState("trangchu");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.replace("/NoSQLProject", "");
    if (path == "/") {
      setSelected("trangchu");
    } else if (path.startsWith("/subject/view")) {
      setSelected("monhoc");
    } else if (path.startsWith("/subject/edit")) {
      setSelected("chinhsuamonhoc");
    } else if (path.startsWith("/donggopde")) {
      setSelected("donggopde");
    } else if (path.startsWith("/login")) {
      setSelected("dangnhap");
    } else if (path.startsWith("/admin")) {
      setSelected("admin");
    } else {
      setSelected("");
    }
  }, [location]);

  return (
    <div className="relative z-10 flex flex-col h-screen w-screen">
      {selected == "trangchu" && <SmokeTrail />}

      {!location.pathname.startsWith("/quizzes/") && selected != "admin" && (
        <div className="h-[5%] w-full my-1">
          <NavBar selected={selected} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<AboutUs />} />
          <Route
            path="/subject/:type"
            element={
              <ProtectedRoute>
                <SubjectPermissionHandler></SubjectPermissionHandler>
              </ProtectedRoute>
            }
          >
            <Route index element={<SubjectPage></SubjectPage>}></Route>
            <Route
              path=":subjectId"
              element={<QuizListPage></QuizListPage>}
            ></Route>

            <Route path="quiz/:id" element={<EditQuizPage/>} />
          </Route>
          <Route
            path="/subject/:type/:subjectId"
            element={
              <ProtectedRoute>
                <QuizListPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingPage></SettingPage>
              </ProtectedRoute>
            }
          ></Route>
          <Route 
          path="/register" 
          element={
           
              <RegisterPage />
            
          } />
            <Route 
          path="/forgot-password" 
          element={
           
              <ForgotPassPage />
            
          } />
          <Route
          
            path="/quizzes/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/review/:quizId"
            element={
              <ProtectedRoute>
                <ReviewQuizPage />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donggopde"
            element={
              <ProtectedRoute>
                <ContributedQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review-contributed/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminReviewContributed />
              </ProtectedRoute>
            }
          />
          <Route path="/login-test" element={<LoginPage_ReduxTest />} />;
          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
