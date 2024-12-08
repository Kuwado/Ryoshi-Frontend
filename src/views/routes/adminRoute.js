import { Routes, Route, Navigate } from "react-router-dom";

import Footer from "../../components/footer";
import UserHeader from "../../components/header/header_user";


function AdminRoute() {
  return (
    <div>
      <div>
        <UserHeader />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="Home" />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default AdminRoute;
