import {
  Button,
  Form,
  Input,
  Card,
  Typography,
  Select,
  Row,
  Col,
  Space,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { signUpApi } from "../utils/Api/accountApi.js";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../styles/register.css";

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const registerData = {
        name: values.fullName,
        email: values.email,
        password: values.password,
        address: values.address,
        phone: values.phone,
        citizenId: values.citizenId,
        gender: values.gender,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      const res = await signUpApi(registerData);

      if (res && res.EC === 0) {
        toast.success(res.EM || "Registration successful!", {
          autoClose: 2000,
        });
        form.resetFields();
        navigate("/login");
      } else {
        toast.error(res?.EM || "Registration failed. Please try again.", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
        autoClose: 2000,
      });
    }
  };

  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter phone number!"));
    }
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error("Phone number must be 10-11 digits!"));
    }
    return Promise.resolve();
  };

  const validateCitizenId = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter Citizen ID!"));
    }
    const citizenIdRegex = /^[0-9]{9,12}$/;
    if (!citizenIdRegex.test(value)) {
      return Promise.reject(new Error("Citizen ID must be 9-12 digits!"));
    }
    return Promise.resolve();
  };

  const validateDOB = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please select date of birth!"));
    }
    const age = dayjs().diff(value, "year");
    if (age < 18) {
      return Promise.reject(new Error("You must be at least 18 years old!"));
    }
    if (age > 100) {
      return Promise.reject(new Error("Please enter a valid date of birth!"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter password!"));
    }
    if (value.length < 6) {
      return Promise.reject(
        new Error("Password must be at least 6 characters!"),
      );
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return Promise.reject(
        new Error("Password must contain uppercase, lowercase and number!"),
      );
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <div className="register-page">
      {/* Left Side - Branding */}
      <div className="register-branding">
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
              <span>Employee Management</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Department Organization</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Performance Tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Candidate Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="register-form-section">
        <Card className="register-card" bordered={false}>
          <div className="form-header">
            <Title level={2} className="form-title">
              Create Account
            </Title>
            <Text className="form-subtitle">
              Join our platform and start managing your workforce
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="register-form"
          >
            <Row gutter={16}>
              {/* Full Name */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please enter your full name!" },
                    { min: 2, message: "Name must be at least 2 characters!" },
                    {
                      max: 100,
                      message: "Name must not exceed 100 characters!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Enter your full name"
                  />
                </Form.Item>
              </Col>

              {/* Email */}
              <Col xs={24} md={12}>
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
              </Col>

              {/* Password */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ validator: validatePassword }]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Create a strong password"
                  />
                </Form.Item>
              </Col>

              {/* Confirm Password */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    validateConfirmPassword,
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                  />
                </Form.Item>
              </Col>

              {/* Phone */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[{ validator: validatePhone }]}
                >
                  <Input
                    size="large"
                    prefix={<PhoneOutlined />}
                    placeholder="Enter phone (10-11 digits)"
                    maxLength={11}
                  />
                </Form.Item>
              </Col>

              {/* Citizen ID */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Citizen ID"
                  name="citizenId"
                  rules={[{ validator: validateCitizenId }]}
                >
                  <Input
                    size="large"
                    prefix={<IdcardOutlined />}
                    placeholder="Enter Citizen ID (9-12 digits)"
                    maxLength={12}
                  />
                </Form.Item>
              </Col>

              {/* Date of Birth */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Date of Birth"
                  name="dob"
                  rules={[{ validator: validateDOB }]}
                >
                  <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Select your date of birth"
                    suffixIcon={<CalendarOutlined />}
                    disabledDate={(current) =>
                      current && current > dayjs().subtract(18, "year")
                    }
                  />
                </Form.Item>
              </Col>

              {/* Gender */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[
                    { required: true, message: "Please select your gender!" },
                  ]}
                >
                  <Select size="large" placeholder="Select gender">
                    <Option value="male">
                      <Space>
                        <ManOutlined style={{ color: "#1890ff" }} />
                        Male
                      </Space>
                    </Option>
                    <Option value="female">
                      <Space>
                        <WomanOutlined style={{ color: "#eb2f96" }} />
                        Female
                      </Space>
                    </Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Address */}
              <Col xs={24}>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    { required: true, message: "Please enter your address!" },
                    {
                      min: 5,
                      message: "Address must be at least 5 characters!",
                    },
                    {
                      max: 200,
                      message: "Address must not exceed 200 characters!",
                    },
                  ]}
                >
                  <Input.TextArea
                    size="large"
                    rows={3}
                    placeholder="Enter your full address"
                    maxLength={200}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button */}
            <Form.Item style={{ marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="register-button"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          {/* Login Link */}
          <div className="login-link">
            <Text>
              Already have an account?{" "}
              <Link to="/login" className="link-text">
                Sign In
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
