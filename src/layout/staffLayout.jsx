import HeaderStaff from "../components/headerStaff";
import { Layout } from "antd";

const { Content } = Layout;

const StaffLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#ffffff" }}>
      <HeaderStaff />
      <Layout>
        <Content
          style={{
            padding: "32px",
            background: "#f6f9fb",
            minHeight: "100vh",
            overflow: "auto",
          }}
        ></Content>
      </Layout>
    </Layout>
  );
};
export default StaffLayout;
