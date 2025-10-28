import { useEffect, useContext } from "react";
import axios from "./utils/axios.customize.js";
import Header from "./layout/header.jsx";
import { AuthContext } from "./context/auth.context.jsx";
import { Spin } from "antd";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get(`/v1/api/account`);
      if (res) {
        setAuth({
          isAuthenticated: true,
          staff: {
            email: res.personalInfor?.email,
            fullName: res.personalInfor?.fullName,
            address: res.personalInfor?.address,
            phone: res.personalInfor?.phone,
            role: res.role ?? res.staff?.role ?? "",
          },
        });
      }
      setAppLoading(false);
    };
    fetchAccount();
  }, [setAuth, setAppLoading]);

  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
        </>
      )}
    </div>
  );
}

export default App;
