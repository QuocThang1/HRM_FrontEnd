import { useState, useContext } from "react";
import { MailOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Menu, notification } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    notification.success({
      message: "Logout Successful",
      description: "You have successfully logged out.",
    });
    setAuth({
      isAuthenticated: false,
      staff: {
        full_name: "",
        email: "",
      },
    });
    setCurrent("home");
    navigate("/login");
  };

  const leftItems = [
    {
      label: <Link to="/">Home Page</Link>,
      key: "home",
      icon: <MailOutlined />,
    },
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to="/staff">Staff</Link>,
            key: "staffs",
            icon: <MailOutlined />,
          },
        ]
      : []),
  ];

  const rightItems = [
    {
      label: `Welcome ${auth?.staff?.email}`,
      key: "SubMenu",
      icon: <SettingOutlined />,
      style: { marginLeft: "auto" },
      children: [
        ...(auth.isAuthenticated
          ? [
              {
                label: <Link to="/profile">Profile</Link>,
                key: "profile",
                icon: <UserOutlined />,
              },
              {
                label: "Logout",
                key: "logout",
              },
            ]
          : [
              {
                label: <Link to="/login">Login</Link>,
                key: "login",
              },
            ]),
      ],
    },
  ];

  const [current, setCurrent] = useState("home");
  const onClick = (e) => {
    setCurrent(e.key);
    if (e.key === "logout") {
      handleLogout();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={leftItems}
        style={{ flex: 1 }}
      />
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={rightItems}
        style={{
          minWidth: 300, // tăng minWidth
          justifyContent: "flex-end",
          borderBottom: "none",
          background: "transparent",
          overflow: "visible", // cho phép label dài hiển thị
          flex: "none",
        }}
      />
    </div>
  );
};

export default Header;
