
import { createContext, useState, useEffect } from "react";
import { getAccountApi } from "../utils/Api/accountApi";
import { Spin } from "antd";

export const AuthContext = createContext({
  isAuthenticated: false,
  staff: {
    name: "",
    email: "",
    address: "",
    phone: "",
    role: "",
  },
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    staff: {
      name: "",
      email: "",
      address: "",
      phone: "",
      role: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setAppLoading(false);
        return;
      }

      try {
        // Gọi API để xác thực token và lấy lại thông tin staff
        const res = await getAccountApi();
        if (res && res.personalInfo) {
          setAuth({
            isAuthenticated: true,
            staff: {
              email: res.personalInfo.email,
              name: res.personalInfo.fullName,
              address: res.personalInfo.address,
              phone: res.personalInfo.phone,
              role: res.role,
            },
          });
        } else {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem("access_token");
          setAuth({
            isAuthenticated: false,
            staff: {
              name: "",
              email: "",
              address: "",
              phone: "",
              role: "",
            },
          });
        }
      } catch (error) {
        console.error("Error fetching account:", error);
        localStorage.removeItem("access_token");
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <>
      {appLoading ? (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Spin size="large" />
        </div>
      ) : (
        <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
          {props.children}
        </AuthContext.Provider>
      )}
    </>
  );
};
