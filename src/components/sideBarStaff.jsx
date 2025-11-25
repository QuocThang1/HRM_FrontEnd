import { Layout, Menu, Avatar, Typography, Badge } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  HomeOutlined,
  FolderOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  LineChartOutlined,
  FileProtectOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";
import "../styles/sideBarStaff.css";

const { Sider } = Layout;
const { Text } = Typography;

const SideBarStaff = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, auth } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    toast.success("Logged out successfully", { autoClose: 2000 });
    setAuth({
      isAuthenticated: false,
      staff: {
        email: "",
        name: "",
        address: "",
        phone: "",
        role: "",
      },
    });
    navigate("/login");
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: "#ff4d4f", text: "Admin" },
      manager: { color: "#1890ff", text: "Manager" },
      staff: { color: "#52c41a", text: "Staff" },
    };
    return badges[role] || badges.staff;
  };

  const roleBadge = getRoleBadge(auth?.staff?.role);

  return (
    <Sider
      width={300}
      collapsed={collapsed}
      collapsedWidth={0}
      className="sidebar-staff"
    >
      {/* Profile Card */}
      <div className="sidebar-profile-card">
        <div className="profile-avatar-wrapper">
          <Avatar
            size={64}
            icon={<UserOutlined />}
            className="profile-avatar"
          />
          <div className="profile-status-dot" />
        </div>

        <div className="profile-info">
          <Text className="profile-name">{auth?.staff?.name || "Staff"}</Text>
          <Badge
            count={roleBadge.text}
            style={{
              backgroundColor: roleBadge.color,
              fontSize: "11px",
              height: "20px",
              lineHeight: "20px",
              borderRadius: "10px",
            }}
          />
        </div>

        <div className="profile-actions">
          <Link to="/" className="profile-btn">
            <HomeOutlined /> Home
          </Link>
          <Link to="/profile" className="profile-btn">
            <UserOutlined /> View Profile
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="sidebar-menu-container">
        <div className="menu-section-title">NAVIGATION</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className="sidebar-menu"
          items={[
            {
              key: "/dashboard",
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            ...(auth?.staff?.role === "admin"
              ? [
                  {
                    key: "/profile/policy-management",
                    icon: <FileProtectOutlined />,
                    label: (
                      <Link to="/profile/policy-management">
                        Policy Management
                      </Link>
                    ),
                  },
                ]
              : []),
            {
              type: "divider",
            },
            ...(auth?.staff?.role === "admin"
              ? [
                  {
                    key: "/profile/candidate-cv-management",
                    icon: <FolderOutlined />,
                    label: (
                      <Link to="/profile/candidate-cv-management">
                        Candidate CVs
                      </Link>
                    ),
                  },
                  {
                    key: "/profile/resignation-management",
                    icon: <FileTextOutlined />,
                    label: (
                      <Link to="/profile/resignation-management">
                        Resignation
                      </Link>
                    ),
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "/profile/employee-management",
                    icon: <TeamOutlined />,
                    label: (
                      <Link to="/profile/employee-management">Employees</Link>
                    ),
                  },
                  {
                    key: "salary-group",
                    icon: <DollarOutlined />,
                    label: "Salaries",
                    children: [
                      {
                        key: "/profile/salary-management",
                        label: (
                          <Link to="/profile/salary-management">
                            Salary Details
                          </Link>
                        ),
                      },
                      {
                        key: "/profile/monthly-salary-create",
                        label: (
                          <Link to="/profile/monthly-salary-create">
                            Monthly Salary Creation
                          </Link>
                        ),
                      },
                      {
                        key: "/profile/salary-dashboard",
                        label: (
                          <Link to="/profile/salary-dashboard">
                            Monthly Salary Report
                          </Link>
                        ),
                      },
                    ],
                  },
                  {
                    key: "department-group",
                    icon: <StarOutlined />,
                    label: "Departments",
                    children: [
                      {
                        key: "/profile/department-management",
                        label: (
                          <Link to="/profile/department-management">
                            Management
                          </Link>
                        ),
                      },
                      {
                        key: "/profile/department-review-management",
                        label: (
                          <Link to="/profile/department-review-management">
                            Reviews
                          </Link>
                        ),
                      },
                    ],
                  },
                  {
                    key: "/profile/shift-management",
                    icon: <ClockCircleOutlined />,
                    label: <Link to="/profile/shift-management">Shifts</Link>,
                  },
                ]
              : []),
            ...(auth?.staff?.role === "manager"
              ? [
                  {
                    key: "/profile/department-shift-management",
                    icon: <CalendarOutlined />,
                    label: (
                      <Link to="/profile/department-shift-management">
                        Shift Management
                      </Link>
                    ),
                  },
                  {
                    key: "/profile/attendance-management",
                    icon: <CalendarOutlined />,
                    label: (
                      <Link to="/profile/attendance-management">
                        Attendance Management
                      </Link>
                    ),
                  },
                  {
                    key: "review-group",
                    icon: <LineChartOutlined />,
                    label: "View Reviews",
                    children: [
                      {
                        key: "/profile/review-statistics",
                        label: (
                          <Link to="/profile/review-statistics">
                            Review Statistics
                          </Link>
                        ),
                      },
                      {
                        key: "/profile/view-reviews",
                        label: (
                          <Link to="/profile/view-reviews">View Reviews</Link>
                        ),
                      },
                    ],
                  },
                  {
                    key: "/profile/my-salaries",
                    icon: <DollarOutlined />,
                    label: <Link to="/profile/my-salaries">My Salaries</Link>,
                  },
                ]
              : []),
            ...(auth?.staff?.role === "staff"
              ? [
                  {
                    key: "/profile/shift-schedule",
                    icon: <CalendarOutlined />,
                    label: (
                      <Link to="/profile/shift-schedule">Shift Schedule</Link>
                    ),
                  },
                  {
                    key: "/profile/attendance",
                    icon: <CalendarOutlined />,
                    label: <Link to="/profile/attendance">Attendance</Link>,
                  },
                  {
                    key: "/profile/my-salaries",
                    icon: <DollarOutlined />,
                    label: <Link to="/profile/my-salaries">My Salaries</Link>,
                  },
                  {
                    key: "/profile/resignation",
                    icon: <FileTextOutlined />,
                    label: (
                      <Link to="/profile/resignation">Submit Resignation</Link>
                    ),
                  },
                  {
                    key: "/candidate-cv-management",
                    icon: <FolderOutlined />,
                    label: (
                      <Link to="/candidate-cv-management">Candidate CVs</Link>
                    ),
                  },
                  {
                    key: "/employee-management",
                    icon: <TeamOutlined />,
                    label: <Link to="/employee-management">Employees</Link>,
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "department-group",
                    icon: <StarOutlined />,
                    label: "Departments",
                    children: [
                      {
                        key: "/department-management",
                        label: (
                          <Link to="/department-management">Management</Link>
                        ),
                      },
                      {
                        key: "/department-review-management",
                        label: (
                          <Link to="/department-review-management">
                            Reviews
                          </Link>
                        ),
                      },
                    ],
                  },
                ]
              : []),
          ]}
        />

        <div className="menu-section-title" style={{ marginTop: "24px" }}>
          SETTINGS
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className="sidebar-menu"
          items={[
            {
              key: "/staff/settings",
              icon: <SettingOutlined />,
              label: <Link to="/staff/settings">Preferences</Link>,
            },
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Sign Out",
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-text">© 2025 HRM System</div>
        <div className="footer-version">Version 1.0.0</div>
      </div>
    </Sider>
  );
};

export default SideBarStaff;
