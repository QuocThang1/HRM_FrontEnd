import { Layout, Menu, Avatar, Typography, Badge } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
  FolderOutlined,
  StarOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";
import "../styles/sideBarStaff.css";

const { Sider } = Layout;
const { Text } = Typography;

const SideBarStaff = () => {
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
    <Sider width={280} className="sidebar-staff">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <SafetyOutlined />
          </div>
          <div className="logo-text">
            <div className="logo-title">HRM System</div>
            <div className="logo-subtitle">Management Portal</div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="sidebar-profile-card">
        <div className="profile-avatar-wrapper">
          <Avatar size={64} icon={<UserOutlined />} className="profile-avatar" />
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
        <Link to="/" className="back-home-btn">
          <ArrowLeftOutlined /> Back to Home
        </Link>
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
              key: "/profile",
              icon: <HomeOutlined />,
              label: <Link to="/profile">Profile</Link>,
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
                  key: "/profile/employee-management",
                  icon: <TeamOutlined />,
                  label: (
                    <Link to="/profile/employee-management">Employees</Link>
                  ),
                },
                {
                  key: "/profile/shift-management",
                  icon: <ClockCircleOutlined />,
                  label: (
                    <Link to="/profile/shift-management">Shifts</Link>
                  ),
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
              ]
              : []),
            ...(auth?.staff?.role === "manager"
              ? [{
                key: "/profile/department-shift-management",
                icon: <CalendarOutlined />,
                label: (
                  <Link to="/profile/department-shift-management">
                    Shift Management
                  </Link>
                ),
              },
              ]
              : []),
            ...(auth?.staff?.role === "staff"
              ? [{
                key: "/profile/shift-schedule",
                icon: <CalendarOutlined />,
                label: (
                  <Link to="/profile/shift-schedule">
                    Shift Schedule
                  </Link>
                ),
              },
              {
                key: "/profile/attendance",
                icon: <CalendarOutlined />,
                label: (
                  <Link to="/profile/attendance">
                    Attendance
                  </Link>
                ),
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
              label: <span onClick={handleLogout}>Sign Out</span>,
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