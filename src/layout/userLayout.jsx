import SideBarUser from "../components/sideBarUser";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "../utils/axios.customize";
import { AuthContext } from "../context/auth.context.jsx";

const UserLayout = () => {

    const { setAuth } = useContext(AuthContext);


    useEffect(() => {
        const fetchAccount = async () => {
            const res = await axios.get(`/v1/api/account`);
            if (res) {
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.email,
                        name: res.name,
                        address: res.address,
                        phone: res.phone,
                    }
                });
            }
        };
        fetchAccount();
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <SideBarUser />
            <div style={{ flex: 1, padding: '24px', background: '#f6f9fb', height: '100vh', width: '100%' }}>
                <Outlet />
            </div>
        </div>
    );
};
export default UserLayout;