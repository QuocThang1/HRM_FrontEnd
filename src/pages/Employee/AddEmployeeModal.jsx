import { Modal, Form, Input, Row, Col, DatePicker, Select, Space } from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    LockOutlined,
    IdcardOutlined,
    CalendarOutlined,
    ManOutlined,
    WomanOutlined,
} from "@ant-design/icons";
import { addNewStaffApi } from "../../utils/Api/staffApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../../styles/addEmployeeModal.css";

const { Option } = Select;

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();

            // Format date before sending
            const formattedValues = {
                ...values,
                dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
            };

            const res = await addNewStaffApi(
                formattedValues.password,
                formattedValues.fullName,
                formattedValues.email,
                formattedValues.phone,
                formattedValues.address,
                formattedValues.citizenId,
                formattedValues.gender,
                formattedValues.dob
            );

            if (res?.data?._id) {
                toast.success(res.EM || "Employee added successfully!", { autoClose: 2000 });
                form.resetFields();
                onClose();
                onSuccess();
            } else {
                toast.error(res?.EM || "Failed to add employee", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error adding employee:", error);
            toast.error("Error adding employee. Please try again.", { autoClose: 2000 });
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
            return Promise.reject(new Error("Employee must be at least 18 years old!"));
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
            return Promise.reject(new Error("Password must be at least 6 characters!"));
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return Promise.reject(
                new Error("Password must contain uppercase, lowercase and number!")
            );
        }
        return Promise.resolve();
    };

    return (
        <Modal
            title={
                <div className="modal-header">
                    <UserOutlined className="modal-header-icon" />
                    <span>Add New Employee</span>
                </div>
            }
            open={open}
            onOk={handleConfirm}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            okText="Add Employee"
            cancelText="Cancel"
            width={800}
            className="add-employee-modal"
            okButtonProps={{
                className: "modal-ok-button",
            }}
        >
            <Form form={form} layout="vertical" className="employee-form">
                <Row gutter={16}>
                    {/* Full Name */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Full Name"
                            name="fullName"
                            rules={[
                                { required: true, message: "Please enter full name!" },
                                { min: 2, message: "Name must be at least 2 characters!" },
                                { max: 100, message: "Name must not exceed 100 characters!" },
                            ]}
                        >
                            <Input
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
                                size="large"
                                prefix={<MailOutlined />}
                                placeholder="Enter email address"
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
                                placeholder="Enter password (min 6 chars)"
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
                                { min: 5, message: "Address must be at least 5 characters!" },
                                {
                                    max: 200,
                                    message: "Address must not exceed 200 characters!",
                                },
                            ]}
                        >
                            <Input.TextArea
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

export default AddEmployeeModal;