import { Routes, Route, Navigate } from "react-router-dom";
import Begin1 from "../pages/begin/begin1";
import Begin1_5 from "../pages/begin/begin1.5";
import Begin1_6 from "../pages/begin/begin1.6";
import Testpage from "../pages/test-page/test-page";
import Header from "../../components/header";
import Footer from "../../components/footer";

function UserRoute(){
  return(
    <div>
      <div>
        <Header />
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="begin1" />} />
          <Route path="/begin1" element={<Begin1 />} />
          <Route path="/begin1.5" element={<Begin1_5 />} />
          <Route path="/begin1.6" element={<Begin1_6 />} />
          <Route path="/test-page" element={<Testpage />} />
        </Routes>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default UserRoute;
