import { Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getStaffNotInDepartmentApi, assignStaffToDepartmentApi } from "../../utils/Api/staffApi";
import { notification } from "antd";

const AddEmployeeToDepartmentModal = ({
    open,
    onClose,
    departmentId,
    onSuccess
}) => {
    const [notInDept, setNotInDept] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) fetchNotInDept();
        // eslint-disable-next-line
    }, [open, departmentId]);

    const fetchNotInDept = async () => {
        try {
            const res = await getStaffNotInDepartmentApi(departmentId);
            if (res && res.EC === 0 && Array.isArray(res.data)) {
                setNotInDept(res.data);
            } else {
                setNotInDept([]);
            }
        } catch {
            setNotInDept([]);
        }
    };

    const handleAddEmployee = async () => {
        if (!selectedStaffId) return;
        setLoading(true);
        try {
            const res = await assignStaffToDepartmentApi(selectedStaffId, departmentId);
            if (res && res.EC === 0) {
                notification.success({ message: "Success", description: "Employee assigned successfully" });
                setSelectedStaffId(null);
                onClose();
                onSuccess && onSuccess();
            } else {
                notification.error({ message: "Error", description: res?.EM || "Failed to assign employee" });
            }
        } catch (error) {
            notification.error({ message: "Error", description: "Cannot assign employee" });
        }
        setLoading(false);
    };

    return (
        <Modal
            title="Add Employee to Department"
            open={open}
            onCancel={() => { onClose(); setSelectedStaffId(null); }}
            onOk={handleAddEmployee}
            okButtonProps={{ disabled: !selectedStaffId, loading }}
            cancelButtonProps={{ disabled: loading }}
        >
            <Spin spinning={loading}>
                <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select employee"
                    optionFilterProp="children"
                    value={selectedStaffId}
                    onChange={setSelectedStaffId}
                    filterOption={(input, option) =>
                        (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {notInDept.map(staff => (
                        <Select.Option key={staff._id} value={staff._id}>
                            {staff.personalInfo?.fullName || staff.username || staff.email}
                        </Select.Option>
                    ))}
                </Select>
            </Spin>
        </Modal>
    );
};

export default AddEmployeeToDepartmentModal;