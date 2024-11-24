import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing-page/landingPage";
import Register from "../pages/register";
import Login from "../pages/login";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AllRoutes;
