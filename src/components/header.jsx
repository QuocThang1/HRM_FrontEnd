import { Layout, Menu, Button, Avatar } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  RocketOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";
import "../styles/header.css";

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

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

  const leftItems = [
    {
      label: <Link to="/">Home Page</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/contact">Contact Us</Link>,
      key: "/contact",
      icon: <PhoneOutlined />,
    },
  ];

  return (
    <AntHeader className="custom-header">
      <div className="header-logo" onClick={() => navigate("/")}>
        <RocketOutlined className="header-logo-icon" />
        <span>HRM System</span>
      </div>

      <Menu
        mode="horizontal"
        items={leftItems}
        className="header-menu"
        theme="dark"
      />

      {/* User Section */}
      <div className="header-user-section">
        {auth?.isAuthenticated ? (
          <>
            <div
              className="header-user-info"
              onClick={() => navigate("/profile")}
            >
              <Avatar
                size={36}
                icon={<UserOutlined />}
                className="header-avatar"
              />
              <div className="header-user-details">
                <div className="header-user-name">
                  {auth?.staff?.name || "User"}
                </div>
                {auth?.staff?.role && (
                  <span className="header-user-role">{auth.staff.role}</span>
                )}
              </div>
            </div>

            <Button
              className="header-logout-btn"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            type="primary"
            onClick={() => navigate("/login")}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Login
          </Button>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;