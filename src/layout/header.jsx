import { Input, Button } from "antd";
import { useState, useContext, useEffect } from "react";
import { useRef } from "react";
import * as Icons from "@ant-design/icons";
import { notification, Avatar } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
const menuItems = [
  {
    key: "dashboard",
    icon: <Icons.AppstoreOutlined />,
    label: "Bảng tin",
    link: "/",
  },
  {
    key: "staff",
    icon: <Icons.TeamOutlined />,
    label: "Nhân sự",
    children: [
      {
        key: "staff-dashboard",
        icon: <Icons.ClockCircleOutlined />,
        label: "Bảng điều khiển",
        link: "/staff/dashboard",
      },
      {
        key: "group",
        icon: <Icons.IdcardOutlined />,
        label: "Quản lý nhóm",
        link: "/staff/group",
      },
      {
        key: "org",
        icon: <Icons.ApartmentOutlined />,
        label: "Sơ đồ tổ chức",
        link: "/staff/org",
      },
      {
        key: "profile",
        icon: <Icons.ProfileOutlined />,
        label: "Hồ sơ nhân sự",
        link: "/staff/profile",
      },
      {
        key: "training",
        icon: <Icons.BookOutlined />,
        label: "Đào tạo",
        link: "/staff/training",
      },
      {
        key: "contract",
        icon: <Icons.FileTextOutlined />,
        label: "Hợp đồng",
        link: "/staff/contract",
      },
      {
        key: "quit",
        icon: <Icons.FileDoneOutlined />,
        label: "Thủ tục nghỉ việc",
        link: "/staff/quit",
      },
      {
        key: "approve",
        icon: <Icons.CheckCircleOutlined />,
        label: "Hệ thống phê duyệt",
        link: "/staff/approve",
      },
      {
        key: "staff-setting",
        icon: <Icons.SettingOutlined />,
        label: "Cài đặt",
        link: "/staff/setting",
      },
    ],
  },
  {
    key: "attendance",
    icon: <Icons.UserOutlined />,
    label: "Chấm công",
    children: [
      {
        key: "checkin",
        icon: <Icons.EditOutlined />,
        label: "Điểm danh",
        link: "/attendance/checkin",
      },
      {
        key: "log",
        icon: <Icons.OrderedListOutlined />,
        label: "Nhật ký Chấm công",
        link: "/attendance/log",
      },
      {
        key: "leave",
        icon: <Icons.SolutionOutlined />,
        label: "Nghỉ phép",
        link: "/attendance/leave",
      },
      {
        key: "shift",
        icon: <Icons.DesktopOutlined />,
        label: "Ca làm việc",
        link: "/attendance/shift",
      },
      {
        key: "shift-manage",
        icon: <Icons.CalendarOutlined />,
        label: "Quản lý ca",
        link: "/attendance/shift-manage",
      },
      {
        key: "shift-type",
        icon: <Icons.EditOutlined />,
        label: "Loại ca",
        link: "/attendance/shift-type",
      },
      {
        key: "report",
        icon: <Icons.LineChartOutlined />,
        label: "Báo cáo",
        link: "/attendance/report",
      },
      {
        key: "attendance-setting",
        icon: <Icons.SettingOutlined />,
        label: "Cài đặt",
        link: "/attendance/setting",
      },
    ],
  },
  {
    key: "setting",
    icon: <Icons.SettingOutlined />,
    label: "Thiết lập",
    link: "/setting",
  },
];

const Header = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // ...existing code...
  // Top header bar
  const topHeaderStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    height: 60,
    background: "#fff",
    borderBottom: "1px solid #f0f0f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  };

  const iconStyle = {
    fontSize: 22,
    color: "#8c939d",
    marginRight: 18,
    cursor: "pointer",
  };
  const rightIconStyle = {
    fontSize: 20,
    color: "#8c939d",
    marginLeft: 18,
    cursor: "pointer",
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    notification.success({
      message: "Logout Successful",
      description: "You have successfully logged out.",
    });
    setAuth({
      isAuthenticated: false,
      staff: {
        fullName: "",
        role: "",
        email: "",
      },
    });
    navigate("/login");
  };

  const handleMenuClick = (key, link) => {
    if (key === "logout") {
      handleLogout();
    } else if (link) {
      navigate(link);
    } else {
      setOpenMenu(openMenu === key ? "" : key);
    }
  };

  // Smooth slide dropdown: keep track of submenu refs and heights
  const [submenuHeights, setSubmenuHeights] = useState({});
  const submenuRefs = {};

  // Calculate submenu height after render
  const setRef = (key, el) => {
    if (el && (!submenuHeights[key] || submenuHeights[key] === 0)) {
      setSubmenuHeights((prev) => ({ ...prev, [key]: el.scrollHeight }));
    }
    submenuRefs[key] = el;
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Top header bar */}
      <div
        style={{
          ...topHeaderStyle,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Icons.MenuOutlined
          style={iconStyle}
          onClick={() => setSidebarCollapsed((v) => !v)}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Input
            size="large"
            placeholder="Tìm kiếm..."
            prefix={<Icons.SearchOutlined style={{ color: "#8c939d" }} />}
            style={{
              width: 320,
              background: "#f5f6fa",
              border: "none",
              borderRadius: 16,
              fontSize: 16,
              color: "#222",
              boxShadow: "none",
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<Icons.PlusCircleFilled />}
            size="large"
            style={{ marginLeft: 16, background: "#1769fa", border: "none" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Icons.RollbackOutlined style={rightIconStyle} />
          <Icons.IdcardOutlined style={rightIconStyle} />
          <Icons.SettingOutlined style={rightIconStyle} />
          <span style={{ color: "#8c939d", fontSize: 16, marginLeft: 6 }}>
            Cài đặt
          </span>
          <Icons.ShareAltOutlined style={rightIconStyle} />
          <Icons.CheckSquareOutlined style={rightIconStyle} />
          <Icons.ClockCircleOutlined style={rightIconStyle} />
          <Icons.BellOutlined style={rightIconStyle} />
        </div>
      </div>
      {/* Sidebar + Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          marginTop: 60,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: sidebarCollapsed ? 80 : 260,
            background: "#fff",
            minHeight: "calc(100vh - 60px)",
            boxShadow: "2px 0 8px #f0f1f2",
            fontFamily: "sans-serif",
            transition: "width 0.3s",
            overflow: "hidden",
          }}
        >
          {/* Sidebar thực tế bắt đầu từ đây */}
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: sidebarCollapsed ? 60 : 180,
                minHeight: sidebarCollapsed ? 60 : 70,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                border: "1px solid #eee",
                marginBottom: 10,
                cursor: "pointer",
                position: "relative",
                padding: sidebarCollapsed ? "10px 0" : "12px 0",
                transition: "width 0.3s, min-height 0.3s, padding 0.3s",
              }}
              onClick={() => setShowUserDropdown((v) => !v)}
              ref={userDropdownRef}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10, // khoảng cách avatar và text
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                }}
              >
                <Avatar
                  size={38}
                  icon={<Icons.UserOutlined />}
                  style={{
                    background: "#e6e8ea",
                    borderRadius: "50%",
                    width: 38,
                    height: 38,
                    minWidth: 38,
                    minHeight: 38,
                    maxWidth: 38,
                    maxHeight: 38,
                  }}
                />
                <div
                  style={{
                    display: sidebarCollapsed ? "none" : "flex",
                    flexDirection: "column",
                    opacity: sidebarCollapsed ? 0 : 1,
                    width: sidebarCollapsed ? 0 : "auto",
                    overflow: "hidden",
                    transition: "opacity 0.3s, width 0.3s",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      textTransform: "uppercase",
                      color: "#222",
                      letterSpacing: 0.5,
                      lineHeight: 1.3,
                      marginBottom: 2,
                    }}
                  >
                    {auth?.staff?.fullName?.trim() ? auth.staff.fullName : ""}
                  </div>
                  {auth?.staff?.role?.trim() && (
                    <div
                      style={{
                        color: "#b0b0b0",
                        fontSize: 14,
                        fontWeight: 400,
                        textTransform: "uppercase",
                      }}
                    >
                      {auth.staff.role}
                    </div>
                  )}
                </div>
              </div>
              {showUserDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    width: "100%",
                    background: "#fff",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
                    borderRadius: 18,
                    zIndex: 100,
                    padding: "12px 0",
                    animation: "dropdownFadeIn 0.2s",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 28px",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#222",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f7fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => navigate("/profile")}
                  >
                    Tiểu sử của tôi
                  </div>
                  <div
                    style={{
                      padding: "12px 28px",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#222",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f7fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => navigate("/profile/chart")}
                  >
                    Biểu đồ thời gian của tôi
                  </div>
                  <div
                    style={{
                      padding: "12px 28px",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#222",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f7fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => navigate("/profile/edit")}
                  >
                    Chỉnh sửa tiểu sử
                  </div>
                  <div
                    style={{
                      padding: "12px 28px",
                      cursor: "pointer",
                      fontSize: 16,
                      color: "#222",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f5f7fa")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span>Ngôn ngữ</span>
                    <Icons.RightOutlined
                      style={{ fontSize: 13, marginLeft: 8 }}
                    />
                  </div>
                  <div
                    style={{
                      padding: "12px 28px",
                      cursor: "pointer",
                      color: "#ff3b1f",
                      fontWeight: 500,
                      fontSize: 16,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fff2f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            {menuItems.map((item) => (
              <div key={item.key}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontWeight: 500,
                    background:
                      openMenu === item.key ? "#f5f5f5" : "transparent",
                    borderLeft:
                      openMenu === item.key
                        ? "4px solid #1890ff"
                        : "4px solid transparent",
                    transition: "background 0.2s",
                    justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  }}
                  onClick={() => handleMenuClick(item.key, item.link)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#e6f7ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      openMenu === item.key ? "#f5f5f5" : "transparent")
                  }
                >
                  <div style={{ fontSize: 18 }}>{item.icon}</div>
                  <span
                    style={{
                      marginLeft: 12,
                      opacity: sidebarCollapsed ? 0 : 1,
                      width: sidebarCollapsed ? 0 : "auto",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.3s, width 0.3s",
                    }}
                  >
                    {item.label}
                  </span>
                  {!sidebarCollapsed &&
                    item.children &&
                    item.children.length > 0 && (
                      <Icons.DownOutlined
                        style={{
                          marginLeft: "auto",
                          fontSize: 16,
                          transition: "transform 0.3s",
                          transform:
                            openMenu === item.key
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      />
                    )}
                </div>
                {item.children && item.children.length > 0 && (
                  <div
                    ref={(el) => setRef(item.key, el)}
                    style={{
                      paddingLeft: 32,
                      maxHeight:
                        openMenu === item.key
                          ? submenuHeights[item.key] || 999
                          : 0,
                      overflow: "hidden",
                      transition:
                        "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      opacity: openMenu === item.key ? 1 : 0,
                    }}
                  >
                    {item.children.map((sub) => (
                      <div
                        key={sub.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 0",
                          cursor: "pointer",
                          color: "#555",
                          borderRadius: 4,
                          fontFamily: "sans-serif",
                          transition: "background 0.2s",
                        }}
                        onClick={() => handleMenuClick(sub.key, sub.link)}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#e6f7ff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {sub.icon}
                        <span style={{ marginLeft: 10 }}>{sub.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Main content area with Outlet */}
        <div
          style={{
            flex: 1,
            background: "#f5f6fa",
            minHeight: "calc(100vh - 60px)",
            padding: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Header;
