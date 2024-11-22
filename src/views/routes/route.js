import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing-page/landingPage";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
};

export default AllRoutes;
