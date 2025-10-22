import { Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { getDepartmentByIdApi, updateDepartmentApi } from "../../../utils/Api/departmentApi";
import { getAvailableManagersApi } from "../../../utils/Api/departmentApi";
import { toast } from "react-toastify";

const EditDepartmentModal = ({ open, onClose, departmentId, onSuccess }) => {
    const [form] = Form.useForm();
    const [managerList, setManagerList] = useState([]);

    useEffect(() => {
        if (open && departmentId) {
            fetchDepartmentDetails();
            fetchManagerList();
        }
    }, [open, departmentId]);

    const fetchManagerList = async () => {
        try {
            const res = await getAvailableManagersApi();
            const managers = Array.isArray(res) ? res : res?.data || [];
            setManagerList(managers);
        } catch (error) {
            console.error("Error fetching staff list:", error);
        }
    };

    const fetchDepartmentDetails = async () => {
        try {
            const res = await getDepartmentByIdApi(departmentId);
            if (res.data) {
                form.setFieldsValue({
                    departmentName: res.data.departmentName,
                    description: res.data.description,
                    managerId: res.data.managerId?.personalInfo.fullName,
                });
            }
        } catch (error) {
            console.error("Error fetching department details:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log("Submitting values:", values);
            const res = await updateDepartmentApi(departmentId, values);
            toast.success(res.EM, { autoClose: 2000 });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating department:", error);
            toast.error("Failed to update department", { autoClose: 2000 });
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
                        notFoundContent="No available manager"
                        options={managerList.map((manager) => ({
                            value: manager._id,
                            label: manager.personalInfo.fullName,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditDepartmentModal;
