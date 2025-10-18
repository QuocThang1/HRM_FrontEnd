import { Button, Form, Input, Card, Typography } from "antd";
import { loginApi } from "../utils/Api/accountApi.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values) => {
    const { email, password } = values;

    const res = await loginApi(email, password);
    if (res && res.EC === 0) {
      localStorage.setItem("access_token", res.access_token);
      toast.success(res.EM, { autoClose: 2000 });
      setAuth({
        isAuthenticated: true,
        staff: {
          email: res?.staff?.email ?? "",
          name: res?.staff?.name ?? "",
          address: res?.staff?.address ?? "",
          phone: res?.staff?.phone ?? "",
          role: res?.staff?.role ?? "",
        },
      });
      navigate("/");
    } else {
      toast.error(res.EM || "Login failed. Please try again.", { autoClose: 2000 });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          borderRadius: 16,
          padding: 24,
        }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {/* <img src="/logo.png" alt="Logo" style={{ width: 60, marginBottom: 12 }} /> */}
          <Title level={2} style={{ marginBottom: 0 }}>
            Đăng nhập
          </Title>
          <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
        </div>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input size="large" placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Text>
            Bạn chưa có tài khoản? <Link to="/register">Đăng kí</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
