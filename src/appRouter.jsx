import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./layout/generalLayout.jsx";
import RegisterPage from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import StaffLayout from "./layout/staffLayout.jsx";
import StaffPage from "./pages/Employee/listOfEmployee.jsx";
import DepartmentPage from "./pages/Department/listOfDeparment.jsx";
import StaffProfilePage from "./pages/staffProfile.jsx";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import ListEmployeeOfDepartment from "./pages/Department/listEmployeeOfDepartment.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "/staff", element: <StaffPage /> },
        ],
    },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
    {
        path: "/profile",
        element: <StaffLayout />,
        children: [
            { index: true, element: <StaffProfilePage /> },
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
            },
            {
                path: "departments/:departmentId/employees",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ListEmployeeOfDepartment />
                    </ProtectedRoute>
                ),
            }
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
