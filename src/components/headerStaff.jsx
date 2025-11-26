import {
  Input,
  Button,
  Badge,
  Popover,
  List,
  Empty,
  Popconfirm,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import {
  PlusCircleFilled,
  MenuOutlined,
  SearchOutlined,
  RollbackOutlined,
  SettingOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/headerStaff.css";
import { Outlet } from "react-router-dom";
import SideBarStaff from "./sideBarStaff";
import axiosInstance from "../utils/axios.customize";

const Header = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [todoSummary, setTodoSummary] = useState({
    periodTasks: 0,
    dueSoon: 0,
    notifications: 0,
  });

  // Popover states for each icon
  const [periodOpen, setPeriodOpen] = useState(false);
  const [dueOpen, setDueOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [periodItems, setPeriodItems] = useState([]);
  const [dueItems, setDueItems] = useState([]);
  const [notifItems, setNotifItems] = useState([]);
  // fetch summary helper so other actions can refresh counts
  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get("/v1/api/todos/summary");
      if (res && res.EC === 0 && res.DT) {
        setTodoSummary({
          periodTasks: res.DT.periodTasks || 0,
          dueSoon: res.DT.dueSoon || 0,
          notifications: res.DT.notifications || 0,
        });
      }
    } catch (error) {
      console.error("Failed to load todo summary:", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchSummary();
    const timer = setInterval(() => {
      if (mounted) fetchSummary();
    }, 60000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const openPeriod = async () => {
    setPeriodOpen(true);
    try {
      const res = await axiosInstance.get("/v1/api/todos/period");
      if (res && res.EC === 0) {
        setPeriodItems(res.DT || []);
      }
    } catch (error) {
      console.error("Failed to load period tasks:", error);
      setPeriodItems([]);
    }
  };

  const openDueSoon = async () => {
    setDueOpen(true);
    try {
      const res = await axiosInstance.get("/v1/api/todos/due-soon");
      if (res && res.EC === 0) {
        setDueItems(res.DT || []);
      }
    } catch (error) {
      console.error("Failed to load due-soon tasks:", error);
      setDueItems([]);
    }
  };

  const openNotifications = async () => {
    setNotifOpen(true);
    try {
      const res = await axiosInstance.get("/v1/api/todos/notifications");
      if (res && res.EC === 0) {
        setNotifItems(res.DT || []);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
      setNotifItems([]);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.post("/v1/api/todos/notifications/mark-all-read");
      await fetchSummary();
      // refresh list if open
      if (notifOpen) openNotifications();
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  };

  const markRead = async (id) => {
    try {
      await axiosInstance.post("/v1/api/todos/notifications/mark-read", { id });
      await fetchSummary();
      if (notifOpen) openNotifications();
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await axiosInstance.delete(`/v1/api/todos/notifications/${id}`);
      await fetchSummary();
      if (notifOpen) openNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };
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
            <div>
              <img src="/logo.svg" alt="Logo" className="header-logo-image" />
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
            placeholder="Search..."
            prefix={<SearchOutlined style={{ color: "#8c939d" }} />}
            className="search-input"
          />
          <Button
            type="primary"
            shape="circle"
            size="large"
            className="add-button"
            aria-label="Add"
            title="Add"
          >
            <PlusCircleFilled style={{ color: "#fff", fontSize: 18 }} />
          </Button>
        </div>
        <div className="right-icons-section">
          <Link to="/">
            <RollbackOutlined className="right-icon" />
          </Link>
          <SettingOutlined className="right-icon" />
          <span className="settings-text">Settings</span>
          <Badge count={todoSummary.periodTasks} offset={[-5, 5]}>
            <Popover
              title="Tasks in Period"
              content={
                periodItems.length === 0 ? (
                  <Empty description="No tasks" />
                ) : (
                  <List
                    dataSource={periodItems}
                    size="small"
                    style={{ width: 350 }}
                    renderItem={(item) => (
                      <List.Item key={item._id}>
                        <List.Item.Meta
                          title={item.title}
                          description={`Due: ${item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "N/A"}`}
                        />
                      </List.Item>
                    )}
                  />
                )
              }
              open={periodOpen}
              onOpenChange={setPeriodOpen}
              trigger="click"
              placement="bottomRight"
            >
              <CheckSquareOutlined
                className="right-icon"
                onClick={openPeriod}
              />
            </Popover>
          </Badge>

          <Badge count={todoSummary.dueSoon} offset={[-5, 5]}>
            <Popover
              title="Due Soon"
              content={
                dueItems.length === 0 ? (
                  <Empty description="No tasks due soon" />
                ) : (
                  <List
                    dataSource={dueItems}
                    size="small"
                    style={{ width: 350 }}
                    renderItem={(item) => (
                      <List.Item key={item._id}>
                        <List.Item.Meta
                          title={item.title}
                          description={`Due: ${item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "N/A"}`}
                        />
                      </List.Item>
                    )}
                  />
                )
              }
              open={dueOpen}
              onOpenChange={setDueOpen}
              trigger="click"
              placement="bottomRight"
            >
              <ClockCircleOutlined
                className="right-icon"
                onClick={openDueSoon}
              />
            </Popover>
          </Badge>

          <Badge count={todoSummary.notifications} offset={[-5, 5]}>
            <Popover
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>Notifications</div>
                  <Space>
                    <Button size="small" type="text" onClick={markAllRead}>
                      Mark all as read
                    </Button>
                  </Space>
                </div>
              }
              content={
                notifItems.length === 0 ? (
                  <Empty description="No notifications" />
                ) : (
                  <List
                    dataSource={notifItems}
                    size="small"
                    style={{ width: 350 }}
                    renderItem={(item) => (
                      <List.Item
                        key={item._id}
                        actions={[
                          <Button
                            key={`mark-${item._id}`}
                            size="small"
                            type="text"
                            icon={<CheckOutlined />}
                            onClick={() => markRead(item._id)}
                          />,
                          <Popconfirm
                            key={`del-${item._id}`}
                            title="Delete this notification?"
                            onConfirm={() => deleteNotif(item._id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              size="small"
                              type="text"
                              icon={<DeleteOutlined />}
                              danger
                            />
                          </Popconfirm>,
                        ]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={`${new Date(item.createdAt).toLocaleString()}`}
                        />
                      </List.Item>
                    )}
                  />
                )
              }
              open={notifOpen}
              onOpenChange={setNotifOpen}
              trigger="click"
              placement="bottomRight"
            >
              <BellOutlined
                className="right-icon"
                onClick={openNotifications}
              />
            </Popover>
          </Badge>
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
