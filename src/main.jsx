import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import StaffLayout from "./layout/staffLayout.jsx";
import StaffPage from "./pages/Admin/listOfEmployee.jsx";
import DepartmentPage from "./pages/Admin/listOfDeparment.jsx";
import { AuthWrapper } from "./context/auth.context.jsx";
import StaffProfilePage from "./pages/staffProfile.jsx";
import ProtectedRoute from "./route/ProtectedRoute.jsx";

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
      {
        path: "employee-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <StaffPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "department-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DepartmentPage />
          </ProtectedRoute>
        ),
      }
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
