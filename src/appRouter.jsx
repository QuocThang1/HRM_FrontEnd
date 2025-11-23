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
import StaffResignationPage from "./pages/Staff/Resignation/staffResignation.jsx";
import AdminResignationManagement from "./pages/Admin/ManageResignation/listOfResignation.jsx";
import SalaryDetail from './pages/Admin/ManageSalary/SalaryDetail/salaryDetail';
import StaffSalaryDetail from './pages/Admin/ManageSalary/SalaryDetail/staffSalaryDetail.jsx';
import SalaryDashboard from './pages/Admin/ManageSalary/SalaryDashboard/salaryDashboard.jsx';
import CreateSalaryByMonth from './pages/Admin/ManageSalary/CreateMonthSalaryForStaff/createSalaryByMonth.jsx';
import ReviewDepartment from "./pages/Manager/reviewDepartmentManagement/reviewDepartment.jsx";
import ReviewStatistics from "./pages/Manager/reviewDepartmentManagement/reviewStatistics.jsx";
import MySalary from "./pages/StaffAndManager/Salary/mySalary.jsx";
import ListOfPolicy from "./pages/Admin/ManagePolicy/listOfPolicy";
import PolicyDetail from "./pages/Admin/ManagePolicy/policyDetail"

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
                path: "policy-management",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ListOfPolicy />
                    </ProtectedRoute>
                ),
            },
            {
                path: "policy-management/:policyId",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <PolicyDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "candidate-cv-management",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CandidateCVManagement />
                    </ProtectedRoute>
                ),
            },
            {
                path: "resignation-management",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminResignationManagement />
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
                path: "salary-management",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <SalaryDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "salary-management/:staffId",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <StaffSalaryDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "monthly-salary-create",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateSalaryByMonth />
                    </ProtectedRoute>
                ),
            },
            {
                path: "salary-dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <SalaryDashboard />
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
                path: "view-reviews",
                element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                        <ReviewDepartment />
                    </ProtectedRoute>
                ),
            },
            {
                path: "review-statistics",
                element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                        <ReviewStatistics />
                    </ProtectedRoute>
                ),
            },
            {
                path: "my-salaries",
                element: (
                    <ProtectedRoute allowedRoles={["staff", "manager"]}>
                        <MySalary />
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
                path: "resignation",
                element: (
                    <ProtectedRoute allowedRoles={["staff"]}>
                        <StaffResignationPage />
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
