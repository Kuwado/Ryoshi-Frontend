import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./views/pages/landing-page/landingPage";
import Login from "./views/pages/login";
import Register from "./views/pages/register";
import ForgotPasswordOne from "./views/pages/forgot-password/forgot-password-1";
import ForgotPasswordTwo from "./views/pages/forgot-password/forgot-password-2";
import ForgotPasswordThree from "./views/pages/forgot-password/forgot-password-3";
import UserRoute from "./views/routes/userRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from "./views/routes/adminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password-one" element={<ForgotPasswordOne />} />
        <Route path="/forgot-password-two" element={<ForgotPasswordTwo />} />
        <Route path="/forgot-password-three" element={<ForgotPasswordThree />} />
        <Route path="/user/*" element={<UserRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
