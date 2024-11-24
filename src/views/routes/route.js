import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/landing-page/landingPage";
import Register from "../pages/register";
import Login from "../pages/login";
import Begin1 from "../pages/begin/begin1";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />

      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/begin_1" element={<Begin1 />} />
    </Routes>
  );
};

export default AllRoutes;
