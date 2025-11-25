import { Input, Button } from "antd";
import { useState } from "react";
import {
  SafetyOutlined,
  PlusCircleFilled,
  MenuOutlined,
  SearchOutlined,
  RollbackOutlined,
  IdcardOutlined,
  SettingOutlined,
  ShareAltOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "../styles/headerStaff.css";
import { Outlet } from "react-router-dom";
import SideBarStaff from "./sideBarStaff";

const Header = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Top header bar

  // Calculate submenu height after render
  return (
    <div className="app-container">
      {/* Top header bar */}
      <div className="top-header top-header-fixed">
        {sidebarCollapsed ? (
          <MenuOutlined
            className="menu-icon"
            onClick={() => setSidebarCollapsed(false)}
          />
        ) : (
          <MenuOutlined
            className="menu-icon"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        {/* Header */}
        <div className="header-logo-section">
          <div className="logo-container">
            <div className="logo-icon-wrapper">
              <SafetyOutlined />
            </div>
            <div className="logo-text-container">
              <div className="logo-title">NextGen Solution</div>
              <div className="logo-subtitle">Management Portal</div>
            </div>
          </div>
        </div>
        <div className="search-section">
          <Input
            size="large"
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined style={{ color: "#8c939d" }} />}
            className="search-input"
          />
          <Button
            type="primary"
            shape="circle"
            size="large"
            className="add-button"
            aria-label="Thêm"
            title="Thêm"
          >
            <PlusCircleFilled style={{ color: "#fff", fontSize: 18 }} />
          </Button>
        </div>
        <div className="right-icons-section">
          <RollbackOutlined className="right-icon" />
          <IdcardOutlined className="right-icon" />
          <SettingOutlined className="right-icon" />
          <span className="settings-text">Cài đặt</span>
          <ShareAltOutlined className="right-icon" />
          <CheckSquareOutlined className="right-icon" />
          <ClockCircleOutlined className="right-icon" />
          <BellOutlined className="right-icon" />
        </div>
      </div>
      {/* Sidebar + Content */}
      <div className="main-content-wrapper">
        <SideBarStaff collapsed={sidebarCollapsed} />
        {/* Main content area with Outlet */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Header;
