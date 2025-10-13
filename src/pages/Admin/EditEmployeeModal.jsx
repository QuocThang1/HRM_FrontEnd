import { Modal, Form, Input, Select, Button, notification } from "antd";
import { useEffect, useState } from "react";
import { detailStaffApi, updateStaffApi } from "../../utils/Api/staffApi";

const { Option } = Select;

const EditEmployeeModal = ({ open, onClose, staffId, onSuccess }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Load dữ liệu chi tiết nhân viên
    useEffect(() => {
        if (staffId && open) {
            const fetchStaff = async () => {
                try {
                    const res = await detailStaffApi(staffId);
                    form.setFieldsValue({
                        username: res.staff?.username,
                        role: res.staff?.role,
                        fullName: res.staff?.personalInfo?.fullName,
                        email: res.staff?.personalInfo?.email,
                        phone: res.staff?.personalInfo?.phone,
                        address: res.staff?.personalInfo?.address,
                        gender: res.staff?.personalInfo?.gender,
                    });
                } catch (error) {
                    notification.error({
                        message: "Error",
                        description: "Failed to load employee details",
                    });
                }
            };
            fetchStaff();
            setIsEditing(false); // reset trạng thái edit
        }
    }, [staffId, open, form]);

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            const updatedData = {
                username: values.username,
                role: values.role,
                personalInfo: {
                    fullName: values.fullName,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                    gender: values.gender,
                },
            };

            setLoading(true);
            await updateStaffApi(staffId, updatedData);
            notification.success({
                message: "Updated",
                description: "Employee updated successfully",
            });
            setLoading(false);
            onSuccess();
            onClose();
        } catch (error) {
            setLoading(false);
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "Failed to update employee",
            });
        }
    };

    return (
        <Modal
            title="Edit Employee"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="edit"
                    type="primary"
                    loading={loading}
                    onClick={() => {
                        if (!isEditing) {
                            setIsEditing(true); // bật chế độ edit
                        } else {
                            handleConfirm(); // confirm update
                        }
                    }}
                >
                    {isEditing ? "Confirm" : "Edit"}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please input username!" }]}
                >
                    <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please select role!" }]}
                >
                    <Select disabled={!isEditing}>
                        <Option value="admin">Admin</Option>
                        <Option value="manager">Manager</Option>
                        <Option value="staff">Staff</Option>
                        <Option value="candidate">Candidate</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please input full name!" }]}
                >
                    <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Invalid email!" }]}
                >
                    <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: "Please input phone!" }]}
                >
                    <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: "Please input address!" }]}
                >
                    <Input disabled={!isEditing} />
                </Form.Item>

                <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: "Please select gender!" }]}
                >
                    <Select disabled={!isEditing}>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditEmployeeModal;
