import { Button, Form, Input, Card, Typography, Checkbox } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { loginApi } from "../utils/Api/accountApi.js";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { toast } from "react-toastify";
import companyImage from "../assets/images/infopicture5.jpg";
import "../styles/login.css";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get("token");
    const refresh_token = searchParams.get("refresh_token");
    const provider = searchParams.get("provider");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Authentication failed. Please try again.", {
        autoClose: 2000,
      });
      window.history.replaceState({}, document.title, "/login");
      return;
    }

    if (token && provider) {
      // Save tokens
      localStorage.setItem("access_token", token);
      if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
      }
      toast.success(`Logged in with ${provider}!`, { autoClose: 2000 });

      // Robust JWT decode (handles base64url and UTF-8 unicode)
      try {
        const parseJwt = (token) => {
          const base64Url = token.split(".")[1];
          if (!base64Url) return null;
          // base64Url -> base64
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          // Pad with '=' to make length a multiple of 4
          const pad = "=".repeat((4 - (base64.length % 4)) % 4);
          const base64Padded = base64 + pad;
          // atob gives binary string; decode UTF-8 percent-encoding
          const binary = atob(base64Padded);
          const percentEncoded = Array.prototype.map
            .call(
              binary,
              (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
            )
            .join("");
          return JSON.parse(decodeURIComponent(percentEncoded));
        };

        const payload = parseJwt(token);
        if (payload) {
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
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
      }

      // Clear URL and navigate
      window.history.replaceState({}, document.title, "/");
      navigate("/");
    }
  }, [searchParams, navigate, setAuth]);

  const onFinish = async (values) => {
    const { email, password } = values;

    const res = await loginApi(email, password);
    if (res && res.EC === 0) {
      localStorage.setItem("access_token", res.access_token);
      // Store refresh token for session persistence
      if (res.refresh_token) {
        localStorage.setItem("refresh_token", res.refresh_token);
      }
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
            <img
              src="/logoWhite.svg"
              alt="Logo"
              className="header-logo-image"
            />
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
              <img
                src="/logoWhite.svg"
                alt="Logo"
                className="header-logo-image"
              />
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
            <a
              href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"}/v1/api/auth/google`}
              className="social-button google"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
              />
              <span>Google</span>
            </a>
            <a
              href={`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"}/v1/api/auth/microsoft`}
              className="social-button microsoft"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft"
              />
              <span>Microsoft</span>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
