import { Modal, Form, Input, Select, notification } from "antd";
import { useEffect, useState } from "react";
import { getDepartmentByIdApi, updateDepartmentApi } from "../../utils/Api/departmentApi";
import { getStaffApi } from "../../utils/Api/staffApi";

const EditDepartmentModal = ({ open, onClose, departmentId, onSuccess }) => {
    const [form] = Form.useForm();
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        if (open && departmentId) {
            fetchDepartmentDetails();
            fetchStaffList();
        }
    }, [open, departmentId]);

    const fetchStaffList = async () => {
        try {
            const res = await getStaffApi();
            setStaffList(res || []);
        } catch (error) {
            console.error("Error fetching staff list:", error);
        }
    };

    const fetchDepartmentDetails = async () => {
        try {
            const res = await getDepartmentByIdApi(departmentId);
            if (res) {
                form.setFieldsValue({
                    departmentName: res.departmentName,
                    description: res.description,
                    managerId: res.managerId?._id,
                });
            }
        } catch (error) {
            console.error("Error fetching department details:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await updateDepartmentApi(departmentId, values);
            notification.success({
                message: "Success",
                description: "Department updated successfully",
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating department:", error);
            notification.error({
                message: "Error",
                description: "Failed to update department",
            });
        }
    };

    return (
        <Modal
            title="Edit Department"
            open={open}
            onOk={handleSubmit}
            onCancel={onClose}
            okText="Save"
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

export default EditDepartmentModal;
