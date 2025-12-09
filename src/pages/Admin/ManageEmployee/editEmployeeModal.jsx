import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  DatePicker,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { detailStaffApi, updateStaffApi } from "../../../utils/Api/staffApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../../../styles/editEmployeeModal.css";

const { Option } = Select;

const EditEmployeeModal = ({ open, onClose, staffId, onSuccess }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staffId && open) {
      const fetchStaff = async () => {
        try {
          const res = await detailStaffApi(staffId);
          const personalInfo = res.data?.personalInfo || {};

          form.setFieldsValue({
            role: res.data?.role,
            fullName: personalInfo.fullName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: personalInfo.address,
            citizenId: personalInfo.citizenId,
            gender: personalInfo.gender,
            dob: personalInfo.dob ? dayjs(personalInfo.dob) : null,
          });
        } catch (error) {
          toast.error("Error fetching employee details", { autoClose: 2000 });
        }
      };
      fetchStaff();
      setIsEditing(false);
    }
  }, [staffId, open, form]);

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        role: values.role,
        personalInfo: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          citizenId: values.citizenId,
          gender: values.gender,
          dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        },
      };

      setLoading(true);
      const res = await updateStaffApi(staffId, updatedData);

      if (res && res.EC === 0) {
        toast.success(res.EM || "Employee updated successfully!", {
          autoClose: 2000,
        });
        onSuccess();
        onClose();
        setIsEditing(false);
      } else {
        toast.error(res.EM || "Failed to update employee", { autoClose: 2000 });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error updating employee", { autoClose: 2000 });
    }
  };

  const validateFullName = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your full name!"));
    }
    const nameRegex = /^[a-zA-Z\s]{2,40}$/;
    if (!nameRegex.test(value)) {
      return Promise.reject(new Error("Name must be at least 2 characters and contain only letters and spaces!"));
    }
    return Promise.resolve();
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
      return Promise.reject(
        new Error("Employee must be at least 18 years old!"),
      );
    }
    if (age > 100) {
      return Promise.reject(new Error("Please enter a valid date of birth!"));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <EditOutlined className="modal-header-icon" />
          <span>Edit Employee Information</span>
        </div>
      }
      open={open}
      onCancel={() => {
        setIsEditing(false);
        onClose();
      }}
      width={800}
      className="edit-employee-modal"
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setIsEditing(false);
            onClose();
          }}
          className="modal-cancel-button"
        >
          Cancel
        </Button>,
        <Button
          key="edit"
          type="primary"
          loading={loading}
          icon={isEditing ? <CheckOutlined /> : <EditOutlined />}
          onClick={() => {
            if (!isEditing) {
              setIsEditing(true);
            } else {
              handleConfirm();
            }
          }}
          className="modal-action-button"
        >
          {isEditing ? "Confirm Changes" : "Edit"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="employee-edit-form">
        <Row gutter={16}>
          {/* Role */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select role!" }]}
            >
              <Select
                disabled={!isEditing}
                size="large"
                placeholder="Select role"
              >
                <Option value="admin">Admin</Option>
                <Option value="manager">Manager</Option>
                <Option value="staff">Staff</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Full Name */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { validator: validateFullName },
              ]}
            >
              <Input
                disabled={!isEditing}
                size="large"
                prefix={<UserOutlined />}
                placeholder="Enter full name"
              />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input
                disabled={!isEditing}
                size="large"
                prefix={<MailOutlined />}
                placeholder="Enter email address"
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
                disabled={!isEditing}
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
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <Select
                disabled={!isEditing}
                size="large"
                placeholder="Select gender"
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
                { min: 5, message: "Address must be at least 5 characters!" },
                {
                  max: 200,
                  message: "Address must not exceed 200 characters!",
                },
              ]}
            >
              <Input.TextArea
                disabled={!isEditing}
                size="large"
                rows={3}
                placeholder="Enter full address"
                maxLength={200}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditEmployeeModal;
