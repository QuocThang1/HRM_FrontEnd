import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import { AuthWrapper } from "./context/auth.context.jsx";
import AppRouter from "./appRouter.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <AppRouter />
      <ToastContainer position="top-right" newestOnTop />
    </AuthWrapper>
  </React.StrictMode>
);


