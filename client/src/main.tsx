import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <div className="font-sans">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </React.StrictMode>
);
