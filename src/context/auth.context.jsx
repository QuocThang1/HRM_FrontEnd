import { createContext, useState, useEffect } from "react";
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
        // Parse JWT to get user info without calling backend
        const parseJwt = (token) => {
          try {
            const base64Url = token.split(".")[1];
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const pad = "=".repeat((4 - (base64.length % 4)) % 4);
            const base64Padded = base64 + pad;
            const binary = atob(base64Padded);
            const percentEncoded = Array.prototype.map
              .call(
                binary,
                (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
              )
              .join("");
            return JSON.parse(decodeURIComponent(percentEncoded));
          } catch (e) {
            console.error("Failed to decode JWT:", e);
            return null;
          }
        };

        const payload = parseJwt(token);
        if (payload) {
          // Check if token is expired
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            // Token expired, try to refresh
            const refresh_token = localStorage.getItem("refresh_token");
            if (refresh_token) {
              try {
                const { refreshTokenApi } = await import(
                  "../utils/Api/accountApi"
                );
                const refreshRes = await refreshTokenApi(refresh_token);
                if (refreshRes && refreshRes.access_token) {
                  localStorage.setItem("access_token", refreshRes.access_token);
                  payload.exp = Math.floor(Date.now() / 1000) + 600; // 10 min from now
                }
              } catch (refreshError) {
                console.error(
                  "Token refresh failed during init:",
                  refreshError,
                );
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setAppLoading(false);
                return;
              }
            } else {
              // No refresh token, need to login
              localStorage.removeItem("access_token");
              setAppLoading(false);
              return;
            }
          }

          // Token is valid, set auth from JWT payload
          setAuth({
            isAuthenticated: true,
            staff: {
              email: payload.email || "",
              name: payload.name || "",
              address: payload.address || "",
              phone: payload.phone || "",
              role: payload.role || "",
            },
          });
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <>
      {appLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <AuthContext.Provider
          value={{
            auth,
            setAuth,
            appLoading,
            setAppLoading,
            logout: () => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
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
            },
          }}
        >
          {props.children}
        </AuthContext.Provider>
      )}
    </>
  );
};
