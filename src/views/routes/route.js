import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing-page/landingPage";
import Register from "../pages/register";
import Begin1 from "../pages/begin/begin1";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/begin_1" element={<Begin1 />} />
    </Routes>
  );
};

export default AllRoutes;
