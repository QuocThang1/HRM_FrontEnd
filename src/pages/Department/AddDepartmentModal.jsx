import { Modal, Form, Input, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { addNewDepartmentApi } from "../../utils/Api/departmentApi";
import { getStaffApi } from "../../utils/Api/staffApi";

const AddDepartmentModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        fetchStaffList();
    }, []);

    const fetchStaffList = async () => {
        try {
            const res = await getStaffApi();
            setStaffList(res || []);
        } catch (error) {
            console.error("Error fetching staff list:", error);
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
                        options={staffList.map((staff) => ({
                            value: staff._id,
                            label: staff.fullName,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddDepartmentModal;
