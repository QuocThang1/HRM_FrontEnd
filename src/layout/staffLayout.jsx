import SideBarStaff from "../components/sideBarStaff";
import { Outlet } from "react-router-dom";

const StaffLayout = () => {

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBarStaff />
      <div
        style={{
          flex: 1,
          padding: "24px",
          background: "#f6f9fb",
          height: "100vh",
          width: "100%",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};
export default StaffLayout;
