import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing-page/landingPage";
import Register from "../pages/register";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AllRoutes;
