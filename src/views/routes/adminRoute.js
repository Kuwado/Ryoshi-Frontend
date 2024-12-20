import { Routes, Route, Navigate } from "react-router-dom";
import AdminHeader from "../../components/header/header_admin";
import Footer from "../../components/footer";
import AdminPlaceList from "../pages/admin-place-list";
import AdminCreatePlace from "../pages/admin-create-place";
import AdminPlaceDetail from "../pages/admin-manage-place";
import SearchResult from "../pages/admin-search-result";

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
          <Route path="/admin-edit-place/:locationId" element={<AdminPlaceDetail />} />
          <Route path="/search-result" element={<SearchResult />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default AdminRoute;
