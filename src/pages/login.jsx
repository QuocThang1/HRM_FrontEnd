import { Button, Form, Input, Card, Typography, Checkbox } from "antd";
import { MailOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { loginApi } from "../utils/Api/accountApi.js";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { toast } from "react-toastify";
import companyImage from "../assets/images/infopicture5.jpg";
import "../styles/login.css";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values) => {
    const { email, password } = values;

    const res = await loginApi(email, password);
    if (res && res.EC === 0) {
      localStorage.setItem("access_token", res.access_token);
      toast.success(res.EM || "Login successful!", { autoClose: 2000 });
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
      toast.error(res.EM || "Login failed. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-branding">
        <img src={companyImage} alt="Company" className="branding-background" />
        <div className="branding-overlay"></div>
        <div className="branding-content">
          <div className="brand-logo">
            <SafetyOutlined />
          </div>
          <Title level={1} className="brand-title">
            HRM System
          </Title>
          <Text className="brand-subtitle">
            Human Resource Management Platform
          </Text>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Streamlined Employee Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Advanced Analytics Dashboard</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure & Reliable Platform</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>24/7 Support & Assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-section">
        <Card className="login-card" bordered={false}>
          <div className="form-header">
            <div className="welcome-icon">
              <SafetyOutlined />
            </div>
            <Title level={2} className="form-title">
              Welcome Back
            </Title>
            <Text className="form-subtitle">
              Sign in to continue to your account
            </Text>
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item>
              <div className="form-options">
                <Checkbox>Remember me</Checkbox>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="login-button"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="register-link">
            <Text>
              Don&apos;t have an account?{" "}
              <Link to="/register" className="link-text">
                Sign Up
              </Link>
            </Text>
          </div>

          <div className="divider">
            <span className="divider-text">or continue with</span>
          </div>

          <div className="social-login">
            <Button className="social-button google" size="large">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
              />
              Google
            </Button>
            <Button className="social-button microsoft" size="large">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft"
              />
              Microsoft
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
