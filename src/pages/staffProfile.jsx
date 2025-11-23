import { useEffect, useContext, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  DatePicker,
  Select,
  Avatar,
  Divider,
  Space,
  Spin,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  SaveOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../context/auth.context.jsx";
import { updateProfileApi, getAccountApi } from "../utils/Api/accountApi.js";
import { getMySalaryApi } from "../utils/Api/salaryApi.js";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../styles/staffProfile.css";

const { Title, Text } = Typography;
const { Option } = Select;

const StaffProfilePage = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [shouldReloadAccount, setShouldReloadAccount] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await getAccountApi();
      if (res) {
        const personalInfo = res.data.personalInfo || {};

        form.setFieldsValue({
          name: personalInfo.fullName,
          email: personalInfo.email,
          address: personalInfo.address,
          phone: personalInfo.phone,
          citizenId: personalInfo.citizenId,
          gender: personalInfo.gender,
          dob: personalInfo.dob ? dayjs(personalInfo.dob) : null,
        });

        setAuth({
          isAuthenticated: true,
          staff: {
            email: personalInfo.email,
            name: personalInfo.fullName,
            address: personalInfo.address,
            phone: personalInfo.phone,
            role: res.data.role,
          },
        });

        // Fetch salary nếu là manager hoặc staff
        if (res.data.role === "manager" || res.data.role === "staff") {
          fetchMySalary();
        }
      }
    };
    fetchAccount();
    setShouldReloadAccount(false);
  }, [setAuth, form, shouldReloadAccount]);

  const fetchMySalary = async () => {
    try {
      setSalaryLoading(true);
      const res = await getMySalaryApi();
      if (res && res.EC === 0 && res.data) {
        setHourlyRate(res.data.hourlyRate);
      } else {
        setHourlyRate(null);
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
      setHourlyRate(null);
    } finally {
      setSalaryLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };

      const res = await updateProfileApi(
        formattedValues.name,
        formattedValues.email,
        formattedValues.address,
        formattedValues.phone,
        formattedValues.citizenId,
        formattedValues.gender,
        formattedValues.dob
      );

      if (res && res.EC === 0) {
        toast.success(res.EM, { autoClose: 2000 });
        setShouldReloadAccount(true);
      } else {
        toast.error(res.EM || "Update failed. Please try again.", {
          autoClose: 2000,
        });
      }
    } catch (err) {
      toast.error("Update failed. Please try again.", { autoClose: 2000 });
    } finally {
      setLoading(false);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const shouldShowSalary =
    auth?.staff?.role === "manager" || auth?.staff?.role === "staff";

  return (
    <div className="staff-profile-page">
      <div className="profile-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              className="profile-avatar"
            />
            <div className="header-info">
              <Title level={2} className="profile-title">
                {auth?.staff?.name || "User Profile"}
              </Title>
              <Space>
                <Text type="secondary">Role:</Text>
                <Text
                  strong
                  style={{ color: "black", textTransform: "capitalize" }}
                >
                  {auth?.staff?.role || "Staff"}
                </Text>
              </Space>
            </div>
          </div>
        </div>

        {/* Salary Information Card - Chỉ hiển thị cho manager và staff */}
        {shouldShowSalary && (
          <Card className="salary-info-card" style={{ marginBottom: 24 }}>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Space>
                <DollarOutlined style={{ fontSize: 18, color: "#52c41a" }} />
                <Title level={5} style={{ margin: 0 }}>
                  Salary Information
                </Title>
              </Space>
              <Divider style={{ margin: "12px 0" }} />
              <Row gutter={16} align="middle">
                <Col xs={24} sm={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Hourly Rate
                    </Text>
                    {salaryLoading ? (
                      <Spin size="small" />
                    ) : hourlyRate !== null ? (
                      <Text
                        strong
                        style={{ fontSize: 24, color: "#52c41a" }}
                      >
                        {formatCurrency(hourlyRate)}/h
                      </Text>
                    ) : (
                      <Tag color="orange">Not Set</Tag>
                    )}
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Monthly Estimate (160h)
                    </Text>
                    {salaryLoading ? (
                      <Spin size="small" />
                    ) : hourlyRate !== null ? (
                      <Text strong style={{ fontSize: 20, color: "#1890ff" }}>
                        {formatCurrency(hourlyRate * 160)}
                      </Text>
                    ) : (
                      <Text type="secondary">-</Text>
                    )}
                  </Space>
                </Col>
              </Row>
            </Space>
          </Card>
        )}

        {/* Form Card */}
        <Card className="profile-form-card">
          <Title level={4} className="form-section-title">
            Personal Information
          </Title>
          <Divider />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={24}>
              {/* Full Name */}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter full name!" },
                    {
                      min: 2,
                      message: "Name must be at least 2 characters!",
                    },
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
                    { required: true, message: "Please enter email!" },
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
                    placeholder="Enter phone number (10-11 digits)"
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
                    placeholder="Select date of birth"
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
                    { required: true, message: "Please select gender!" },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Select gender"
                    suffixIcon={<UserOutlined />}
                  >
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
                    { required: true, message: "Please enter address!" },
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
            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                block
                className="submit-button"
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default StaffProfilePage;