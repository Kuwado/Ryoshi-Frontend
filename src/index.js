import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import '@fontsource/risque'; // Import toàn bộ font Risque
import '@fontsource/noto-sans-jp'; // Import toàn bộ font Noto Sans JP
import 'bootstrap/dist/css/bootstrap.min.css';



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
