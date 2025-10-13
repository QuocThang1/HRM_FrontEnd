import { createContext, useState } from "react";

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

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};
