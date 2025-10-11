import { Layout, Menu, Avatar, Typography } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Text } = Typography;

const SideBarStaff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, auth } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      staff: { name: "", email: "" },
    });
    navigate("/login");
  };

  return (
    <Sider
      width={270}
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "4px 0 20px rgba(102, 126, 234, 0.15)",
        position: "relative",
        overflow: "hidden",
        height: "650px",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />

      {/* Staff profile section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px 24px 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            marginBottom: 16,
          }}
        >
          <Avatar
            size={72}
            icon={<UserOutlined />}
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
              color: "#667eea",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 18,
              height: 18,
              background: "#52c41a",
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            }}
          />
        </div>
        <Text
          strong
          style={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 600,
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          {auth?.staff?.name || "Staff"}
        </Text>
        <div
          style={{
            width: "60%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
            marginTop: 16,
            borderRadius: 1,
          }}
        />
      </div>

      {/* Menu section */}
      <div style={{ padding: "0 16px", position: "relative", zIndex: 2 }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            background: "transparent",
            border: "none",
            color: "#ffffff",
          }}
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
              style: {
                borderRadius: "12px",
                marginBottom: "8px",
                transition: "all 0.3s ease",
              },
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
              style: {
                borderRadius: "12px",
                marginBottom: "8px",
                transition: "all 0.3s ease",
              },
            },
            {
              key: "Department Management",
              icon: <TeamOutlined style={{ fontSize: "16px" }} />,
              label: (
                <Link
                  to="/profile/department-management"
                  style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Department Management
                </Link>
              ),
              style: {
                borderRadius: "12px",
                marginBottom: "8px",
                transition: "all 0.3s ease",
              },
            },
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
              style: {
                borderRadius: "12px",
                marginBottom: "8px",
                transition: "all 0.3s ease",
              },
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
              style: {
                borderRadius: "12px",
                marginBottom: "8px",
                transition: "all 0.3s ease",
              },
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default SideBarStaff;
