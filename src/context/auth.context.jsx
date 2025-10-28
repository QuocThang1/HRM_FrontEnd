import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  staff: {
    fullName: "",
    email: "",
    address: "",
    phone: "",
  },
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    staff: {
      fullName: "",
      email: "",
      address: "",
      phone: "",
      role: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};
