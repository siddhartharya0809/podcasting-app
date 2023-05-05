import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { init } from "zipyai";

// if (process.env.REACT_APP_ZIPY_KEY) {
//   init(process.env.REACT_APP_ZIPY_KEY);
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
