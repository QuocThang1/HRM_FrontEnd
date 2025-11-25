import { Button, Form, Input, Card, Typography } from "antd";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../utils/Api/accountApi.js";
import companyImage from "../assets/images/infopicture5.jpg";
import "../styles/login.css";

const { Title, Text } = Typography;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const email = query.get("email") || "";
  const otp = query.get("otp") || "";

  const onFinish = async (values) => {
    const { newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 2000 });
      return;
    }

    try {
      const res = await resetPasswordApi(email, otp, newPassword);
      if (res && res.EC === 0) {
        toast.success(res.EM || "Password reset successfully", {
          autoClose: 2000,
        });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        toast.error(res.EM || "Invalid or expired token", { autoClose: 3000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred", { autoClose: 3000 });
    }
  };

  return (
    <div className="login-page">
      <div className="login-branding">
        <img src={companyImage} alt="Company" className="branding-background" />
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
          <Text className="brand-subtitle">Reset your password</Text>
        </div>
      </div>

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
              Set a new password
            </Title>
            <Text className="form-subtitle">
              Enter your new password to continue.
            </Text>
          </div>

          <Form
            name="reset"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 6, message: "Minimum 6 characters" },
              ]}
            >
              <Input.Password size="large" placeholder="New password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your new password" },
              ]}
            >
              <Input.Password size="large" placeholder="Confirm password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="login-button"
              >
                Update password
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

export default ResetPasswordPage;
