import React from "react";
import ReactDOM from "react-dom/client";
import { AuthWrapper } from "./context/auth.context.jsx";
import AppRouter from "./appRouter.jsx";
import ChatBotWidget from "./pages/chatBotWidget.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <AppRouter />
      <ToastContainer position="top-right" newestOnTop />
      <ChatBotWidget />
    </AuthWrapper>
  </React.StrictMode>,
);
