import { useState, useEffect } from "react";
import { Modal, Button, List, Empty, Tag } from "antd";
import { PlusOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { getAvailableShiftsForDepartmentApi } from "../../../utils/Api/departmentShiftApi";
import { toast } from "react-toastify";
import "../../../styles/addDepartmentShiftModal.css";

const AddShiftModal = ({ open, onClose, departmentId, onSuccess }) => {
    const [availableShifts, setAvailableShifts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingShift, setAddingShift] = useState(null);

    useEffect(() => {
        if (open && departmentId) {
            fetchAvailableShifts();
        }
    }, [open, departmentId]);

    const fetchAvailableShifts = async () => {
        try {
            setLoading(true);
            const res = await getAvailableShiftsForDepartmentApi(departmentId);
            if (res && Array.isArray(res.data)) {
                setAvailableShifts(res.data);
            } else {
                setAvailableShifts([]);
                toast.error(res?.EM || "Failed to load available shifts", {
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Error fetching available shifts:", error);
            toast.error("Cannot fetch available shifts from server", {
                autoClose: 2000,
            });
            setAvailableShifts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddShift = async (shiftId) => {
        setAddingShift(shiftId);
        try {
            await onSuccess(shiftId);
            // Refresh danh sách sau khi thêm thành công
            await fetchAvailableShifts();
        } catch (error) {
            // Error đã được xử lý ở parent component
        } finally {
            setAddingShift(null);
        }
    };

    const handleCancel = () => {
        setAvailableShifts([]);
        onClose();
    };

    return (
        <Modal
            title={
                <div className="modal-title">
                    <PlusOutlined className="modal-icon" />
                    <span>Add New Shift</span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={650}
            className="add-shift-modal"
        >
            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                </div>
            ) : availableShifts.length === 0 ? (
                <Empty
                    description="No available shifts to add"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button onClick={handleCancel}>Close</Button>
                </Empty>
            ) : (
                <div className="shifts-list">
                    <List
                        dataSource={availableShifts}
                        renderItem={(shift) => (
                            <List.Item
                                className="shift-list-item"
                                actions={[
                                    <Button
                                        key={`add-${shift._id}`}
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => handleAddShift(shift._id)}
                                        loading={addingShift === shift._id}
                                        className="add-btn"
                                    >
                                        Add
                                    </Button>,
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div className="shift-icon-wrapper">
                                            <ClockCircleOutlined className="shift-icon" />
                                        </div>
                                    }
                                    title={
                                        <div className="shift-title">
                                            <span className="shift-code">
                                                {shift.shiftCode}
                                            </span>
                                            {shift.isOvertime === "overtime" && (
                                                <Tag color="orange" className="overtime-tag">
                                                    Overtime
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div className="shift-details">
                                            <div className="time-info">
                                                <ClockCircleOutlined className="detail-icon" />
                                                <span>
                                                    {shift.fromTime} - {shift.toTime}
                                                </span>
                                            </div>
                                            <div className="tolerance-info">
                                                <div className="tolerance-item">
                                                    <span className="label">Late:</span>
                                                    <span className="value">
                                                        {shift.allowedLateMinute} min
                                                    </span>
                                                </div>
                                                <div className="tolerance-item">
                                                    <span className="label">
                                                        Early Leave:
                                                    </span>
                                                    <span className="value">
                                                        {shift.allowedEarlyLeaveMinute} min
                                                    </span>
                                                </div>
                                            </div>
                                            {shift.description && (
                                                <div className="shift-description">
                                                    {shift.description}
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </Modal>
    );
};

export default AddShiftModal;