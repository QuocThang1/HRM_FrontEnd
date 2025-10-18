import { Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { getStaffNotInDepartmentApi, assignStaffToDepartmentApi } from "../../utils/Api/staffApi";
import { toast } from "react-toastify";

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
                toast.success(res.EM, { autoClose: 2000 });
                setSelectedStaffId(null);
                onClose();
                onSuccess && onSuccess();
            } else {
                toast.error(res?.EM || "Failed to assign employee", { autoClose: 2000 });
            }
        } catch (error) {
            toast.error("Error assigning employee", { autoClose: 2000 });
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
                    notFoundContent="No available staff"
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