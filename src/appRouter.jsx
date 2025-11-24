import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./layout/generalLayout.jsx";
import RegisterPage from "./pages/register.jsx";
import ForgotPasswordPage from "./pages/forgot-password.jsx";
import ResetPasswordPage from "./pages/reset-password.jsx";
import EnterOtpPage from "./pages/enter-otp.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import StaffLayout from "./layout/staffLayout.jsx";
import StaffPage from "./pages/Employee/listOfEmployee.jsx";
import DepartmentPage from "./pages/Department/ManageDepartment/listOfDeparment.jsx";
import StaffProfilePage from "./pages/staffProfile.jsx";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import ListEmployeeOfDepartment from "./pages/Department/ManageEmployee/listEmployeeOfDepartment.jsx";
import ManageDepartmentReview from "./pages/Department/ManageDepartmentReview/departmentReview.jsx";
import ContactPage from "./pages/contact.jsx";
import ApplyCVPage from "./pages/applyCV.jsx";
import CandidateCVManagement from "./pages/Candidate/candidateCVManagement.jsx";
import Dashboard from "./pages/dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/contact", element: <ContactPage /> },
      {
        path: "/apply-cv",
        element: (
          <ProtectedRoute allowedRoles={["candidate"]}>
            <ApplyCVPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/enter-otp", element: <EnterOtpPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  {
    element: (
      <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <StaffProfilePage />,
      },
      {
        path: "/candidate-cv-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <CandidateCVManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/employee-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <StaffPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/department-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DepartmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/department-review-management",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageDepartmentReview />
          </ProtectedRoute>
        ),
      },
      {
        path: "/departments/:departmentId/employees",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ListEmployeeOfDepartment />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
