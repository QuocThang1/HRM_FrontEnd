import { Button, Form, Input, Card, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPasswordApi } from "../utils/Api/accountApi.js";
import companyImage from "../assets/images/infopicture5.jpg";
import "../styles/login.css";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email } = values;
    try {
      const frontendUrl = window.location.origin; // pass current frontend origin so backend can build link or send OTP
      const res = await forgotPasswordApi(email, frontendUrl);
      if (res && res.EC === 0) {
        toast.success(
          res.EM ||
            `If ${email} is registered, a verification code has been sent.`,
          { autoClose: 2000 },
        );
        // navigate to OTP entry page with email as query
        setTimeout(
          () => navigate(`/enter-otp?email=${encodeURIComponent(email)}`),
          800,
        );
      } else {
        toast.error(res.EM || "Could not process request", { autoClose: 3000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.", {
        autoClose: 3000,
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
          <Text className="brand-subtitle">Password recovery</Text>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Receive a reset link via email</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure verification flow</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Quick account recovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
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
              Forgot your password?
            </Title>
            <Text className="form-subtitle">
              Enter your email and we&apos;ll send a reset link.
            </Text>
          </div>

          <Form
            name="forgot"
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="login-button"
              >
                Send reset link
              </Button>
            </Form.Item>
          </Form>

          <div className="register-link">
            <Text>
              Remembered?{" "}
              <Link to="/login" className="link-text">
                Back to Sign In
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
