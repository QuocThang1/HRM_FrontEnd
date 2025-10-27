import SideBarStaff from "../components/sideBarStaff";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

const { Content } = Layout;

const StaffLayout = () => {

  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <SideBarStaff />
      <Layout>
        <Content
          style={{
            padding: "32px",
            background: "#f6f9fb",
            minHeight: "100vh",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default StaffLayout;
