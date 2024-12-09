import { Routes, Route, Navigate } from "react-router-dom";

import Footer from "../../components/footer";
import UserHeader from "../../components/header/header_user";
import AdminPlaceList from "../pages/admin-place-list";
import AdminCreatePlace from "../pages/admin-create-place";


function AdminRoute() {
  return (
    <div>
      <div>
        <UserHeader />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="admin-place-list" />} />
          <Route path="/admin-place-list" element={<AdminPlaceList />} />
          <Route path="/admin-create-place" element={<AdminCreatePlace />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default AdminRoute;
