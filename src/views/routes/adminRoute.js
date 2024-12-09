import { Routes, Route, Navigate } from "react-router-dom";
import AdminHeader from "../../components/header/header_admin";
import Footer from "../../components/footer";
import AdminPlaceList from "../pages/admin-place-list";
import AdminCreatePlace from "../pages/admin-create-place";


function AdminRoute() {
  return (
    <div>
      <div>
        <AdminHeader />
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
