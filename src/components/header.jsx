import { Layout, Menu, Button, Avatar } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  RocketOutlined,
  PhoneOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";
import "../styles/header.css";

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      key: "/",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/contact">Contact Us</Link>,
      key: "/contact",
      icon: <PhoneOutlined />,
    },
    {
      label: <Link to="/about">About Us</Link>,
      key: "/about",
      icon: <InfoCircleOutlined />,
    },
    ...(auth?.staff?.role === "candidate"
      ? [
          {
            label: <Link to="/apply-cv">Apply CV</Link>,
            key: "/apply-cv",
            icon: <FileTextOutlined />,
          },
        ]
      : []),
  ];

  return (
    <AntHeader className="custom-header">
      <div className="header-logo" onClick={() => navigate("/")}>
        <RocketOutlined className="header-logo-icon" />
        <span>NextGen Solution</span>
      </div>

      <Menu
        mode="horizontal"
        items={leftItems}
        className="header-menu"
        selectedKeys={[location.pathname]}
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
            className="header-login-btn"
          >
            Login
          </Button>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
