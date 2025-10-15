import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import { AuthWrapper } from "./context/auth.context.jsx";
import AppRouter from "./appRouter.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <AppRouter />
    </AuthWrapper>
  </React.StrictMode>
);


