import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/register.jsx";
import StaffPage from "./pages/staff.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import StaffLayout from "./layout/staffLayout.jsx";
import { AuthWrapper } from "./context/auth.context.jsx";
import StaffProfilePage from "./pages/staffProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/staff",
        element: <StaffPage />,
      },
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/profile",
    element: <StaffLayout />,
    children: [
      {
        index: true,
        element: <StaffProfilePage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
);
