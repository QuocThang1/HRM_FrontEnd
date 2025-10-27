import { Layout, Menu, Avatar, Typography, Button } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useLocation } from "react-router-dom";
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

  return (
    <Sider width={300} className="sidebar-staff">
      <div className="sidebar-back-btn">
        <Link to="/">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="sidebar-back-btn-inner"
          >
            Back
          </Button>
        </Link>
      </div>
      {/* Background decoration */}
      <div className="sidebar-bg-top" />
      <div className="sidebar-bg-bottom" />

      {/* Staff profile section */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar-wrap">
          <Avatar
            size={72}
            icon={<UserOutlined />}
            className="sidebar-avatar"
          />
          <div className="sidebar-avatar-status" />
        </div>
        <Text strong className="sidebar-staff-name">
          {auth?.staff?.name || "Staff"}
        </Text>
        <div className="sidebar-divider" />
      </div>

      {/* Menu section */}
      <div className="sidebar-menu-wrap">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          theme="dark"
          items={[
            {
              key: "profile",
              icon: <UserOutlined style={{ fontSize: "16px" }} />,
              label: (
                <Link
                  to="/profile"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Profile
                </Link>
              ),
            },
            ...(auth?.staff?.role === "admin"
              ? [
                {
                  key: "Candidate CV Management",
                  icon: <TeamOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      to="/profile/candidate-cv-management"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Candidate CV Management
                    </Link>
                  ),
                },
                {
                  key: "Employee Management",
                  icon: <TeamOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      to="/profile/employee-management"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Employee Management
                    </Link>
                  ),
                },
                {
                  key: "department",
                  icon: <TeamOutlined />,
                  label: "Department",
                  children: [
                    {
                      key: "department-management",
                      label: (
                        <Link to="/profile/department-management">
                          Department Management
                        </Link>
                      ),
                    },
                    {
                      key: "department-review-management",
                      label: (
                        <Link to="/profile/department-review-management">
                          Department Review Management
                        </Link>
                      ),
                    },
                  ],
                },
              ]
              : []),
            {
              key: "settings",
              icon: <SettingOutlined style={{ fontSize: "16px" }} />,
              label: (
                <Link
                  to="/staff/settings"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Setting
                </Link>
              ),
            },
            {
              key: "logout",
              icon: <LogoutOutlined style={{ fontSize: "16px" }} />,
              label: (
                <span
                  onClick={handleLogout}
                  style={{
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Log Out
                </span>
              ),
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default SideBarStaff;