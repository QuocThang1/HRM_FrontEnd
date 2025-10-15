import { Modal, Form, Input, notification } from "antd";
import { addNewStaffApi } from "../../utils/Api/staffApi";

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            const res = await addNewStaffApi(
                values.username,
                values.password,
                values.fullName,
                values.email,
                values.phone,
                values.address
            );

            if (res?.staff?._id) {
                notification.success({
                    message: "Success",
                    description: "New employee added successfully!",
                });
                form.resetFields();
                onClose(); // đóng modal
                onSuccess(); // reload danh sách
            } else {
                notification.error({
                    message: "Error",
                    description: res?.data?.message || "Failed to add employee",
                });
            }
        } catch (error) {
            console.error("Error adding employee:", error);
            notification.error({
                message: "Error",
                description: "Something went wrong!",
            });
        }
    };

    return (
        <Modal
            title="Add New Employee"
            open={open}
            onOk={handleConfirm}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            okText="Confirm"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please input username!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input password!" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please input full name!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: "email", message: "Invalid email!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: "Please input phone number!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: "Please input address!" }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEmployeeModal;
