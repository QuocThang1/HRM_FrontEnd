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
            email: res.personalInfo?.email,
            name: res.personalInfo?.fullName,
            address: res.personalInfo?.address,
            phone: res.personalInfo?.phone,
            role: res.role,
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
