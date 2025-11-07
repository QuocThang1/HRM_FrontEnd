import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./layout/generalLayout.jsx";
import RegisterPage from "./pages/register.jsx";
import HomePage from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import StaffLayout from "./layout/staffLayout.jsx";
import StaffPage from "./pages/Admin/ManageEmployee/listOfEmployee.jsx";
import DepartmentPage from "./pages/Admin/ManageDepartment/listOfDeparment.jsx";
import StaffProfilePage from "./pages/staffProfile.jsx";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import ListEmployeeOfDepartment from "./pages/Admin/ManageEmployeeOfDepartment/listEmployeeOfDepartment.jsx";
import ManageDepartmentReview from "./pages/Admin/ManageDepartmentReview/departmentReview.jsx";
import ContactPage from "./pages/contact.jsx";
import ApplyCVPage from "./pages/applyCV.jsx";
import CandidateCVManagement from "./pages/Candidate/candidateCVManagement.jsx";
import ShiftManagementPage from "./pages/Admin/ManageShiftType/listOfShift.jsx";
import ManagerDepartmentPage from "./pages/Manager/departmentShiftManagement/dashBoardDepartment.jsx";
import DepartmentShiftsPage from "./pages/Manager/departmentShiftManagement/departmentShifts.jsx";
import StaffShiftAssignmentPage from "./pages/Manager/staffShiftManagement/staffShiftAssignment.jsx";
import StaffShiftSchedulePage from "./pages/Staff/ShiftSchedule/staffShiftSchedule.jsx";
import StaffAttendancePage from "./pages/Staff/Attendance/staffAttendance";
import ManagerAttendanceManagement from "./pages/Manager/attendanceManagement/attendanceManagement";
import AboutPage from "./pages/about.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "/contact", element: <ContactPage /> },
            { path: "/about", element: <AboutPage /> },
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
    {
        path: "/profile",
        element: (
            <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
                <StaffLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <StaffProfilePage /> },
            {
                path: "candidate-cv-management",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CandidateCVManagement />
                    </ProtectedRoute>
                ),
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
                path: "shift-management",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ShiftManagementPage />
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
                path: "department-shift-management",
                element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                        <ManagerDepartmentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "department-shift-management/:departmentId",
                element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                        <DepartmentShiftsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "staff-shift-assignment/:staffId",
                element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                        <StaffShiftAssignmentPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "attendance-management",
                element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                        <ManagerAttendanceManagement />
                    </ProtectedRoute>
                ),
            },
            {
                path: "shift-schedule",
                element: (
                    <ProtectedRoute allowedRoles={["staff"]}>
                        <StaffShiftSchedulePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "attendance",
                element: (
                    <ProtectedRoute allowedRoles={["staff"]}>
                        <StaffAttendancePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "department-review-management",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageDepartmentReview />
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
