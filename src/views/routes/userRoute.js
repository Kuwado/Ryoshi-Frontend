import { Routes, Route, Navigate } from "react-router-dom";
import Begin1 from "../pages/begin/begin1";
import Begin1_5 from "../pages/begin/begin1.5";
import Begin1_6 from "../pages/begin/begin1.6";
import Begin1_75 from "../pages/begin/begin1.75";
import Begin2 from "../pages/begin/begin2";
import Home from "../pages/home";
import Footer from "../../components/footer";
import UserHeader from "../../components/header/header_user";
import TravelList from "../pages/travel-list";
import SearchResult from "../pages/user-search-result";
import PlaceDetail from "../pages/place-detail";
import UserProfile from "../pages/user-profile";

function UserRoute() {
  return (
    <div>
      <div>
        <UserHeader />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="home" />} />
          <Route path="/begin1" element={<Begin1 />} />
          <Route path="/begin1.5" element={<Begin1_5 />} />
          <Route path="/begin1.6" element={<Begin1_6 />} />
          <Route path="/begin1.75" element={<Begin1_75 />} />
          <Route path="/begin2" element={<Begin2 />} />
          <Route path="/home" element={<Home />} />
          <Route path="/travel-list/:region" element={<TravelList />} />
          <Route path="/search-result" element={<SearchResult />} />
          <Route path="/place-detail/:locationId" element={<PlaceDetail />} />
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default UserRoute;
