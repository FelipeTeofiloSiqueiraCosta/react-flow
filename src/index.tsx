import React from "react";
import ReactDOM from "react-dom/client";
import "reactflow/dist/style.css";
import App from "./App";
import { worker } from "./mocks/browser";

if (process.env.REACT_APP_ENVIRONMENT === "DEV") {
  worker.start();
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
