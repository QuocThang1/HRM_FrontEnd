import { Modal, Form, Input, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { addNewDepartmentApi, getAvailableManagersApi } from "../../utils/Api/departmentApi";

const AddDepartmentModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [managerList, setManagerList] = useState([]);

    useEffect(() => {
        if (open) {
            fetchManagerList();
            form.resetFields();
        }
    }, [open]);

    const fetchManagerList = async () => {
        try {
            const res = await getAvailableManagersApi();
            // Nếu API trả về {EC, EM, data}, lấy res.data. Nếu trả về mảng thì lấy luôn res.
            const managers = Array.isArray(res) ? res : res?.data || [];
            setManagerList(managers);
        } catch (error) {
            setManagerList([]);
            console.error("Error fetching manager list:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await addNewDepartmentApi(values.departmentName, values.description, values.managerId);
            notification.success({
                message: "Success",
                description: "Department created successfully",
            });
            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating department:", error);
            notification.error({
                message: "Error",
                description: "Failed to create department",
            });
        }
    };

    return (
        <Modal
            title="Add Department"
            open={open}
            onOk={handleSubmit}
            onCancel={onClose}
            okText="Create"
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Department Name"
                    name="departmentName"
                    rules={[{ required: true, message: "Please input department name" }]}
                >
                    <Input placeholder="Enter department name" />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} placeholder="Enter department description" />
                </Form.Item>

                <Form.Item label="Manager" name="managerId">
                    <Select
                        allowClear
                        placeholder="Select manager"
                        notFoundContent="No available manager"
                        options={managerList.map((manager) => ({
                            value: manager._id,
                            label: manager.fullName || manager.personalInfo?.fullName || manager.email,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddDepartmentModal;