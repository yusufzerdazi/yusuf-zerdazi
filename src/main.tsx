import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// The EPK is a separate page at /epk/; send the slashless URL there
if (window.location.pathname === "/epk") {
  window.location.replace("/epk/");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
