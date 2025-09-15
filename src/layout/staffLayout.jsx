import SideBarStaff from "../components/sideBarStaff";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "../utils/axios.customize";
import { AuthContext } from "../context/auth.context.jsx";

const StaffLayout = () => {
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await axios.get(`/v1/api/account`);
      if (res) {
        setAuth({
          isAuthenticated: true,
          staff: {
            email: res.personal_info?.email,
            name: res.personal_info?.full_name,
            address: res.personal_info?.address,
            phone: res.personal_info?.phone,
          },
        });
      }
    };
    fetchAccount();
  }, [setAuth]);

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
