import { Modal, List, Tag, Typography, Empty } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../../../styles/shiftDetailsModal.css";

const { Text, Title } = Typography;

const ShiftDetailsModal = ({ open, onClose, date, assignments }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "scheduled":
                return "warning";
            case "completed":
                return "success";
            default:
                return "default";
        }
    };

    return (
        <Modal
            title={
                <div className="modal-title">
                    <CalendarOutlined className="modal-icon" />
                    <span>
                        Shifts on {date ? dayjs(date).format("DD/MM/YYYY") : ""}
                    </span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            className="shift-details-modal"
        >
            {assignments.length === 0 ? (
                <Empty description="No shifts on this date" />
            ) : (
                <List
                    dataSource={assignments}
                    renderItem={(assignment) => (
                        <List.Item
                            key={assignment._id}
                            className={`shift-detail-item ${assignment.status}`}
                        >
                            <div className="shift-detail-content">
                                <div className="shift-header">
                                    <div className="shift-icon-wrapper">
                                        <ClockCircleOutlined className="shift-icon" />
                                    </div>
                                    <div className="shift-title-section">
                                        <Title level={4} className="shift-name">
                                            {assignment.shiftType?.shiftCode || "N/A"}
                                        </Title>
                                        <Tag
                                            color={getStatusColor(
                                                assignment.status
                                            )}
                                        >
                                            {assignment.status?.toUpperCase()}
                                        </Tag>
                                        {assignment.shiftType?.isOvertime ===
                                            "overtime" && (
                                                <Tag color="orange">Overtime</Tag>
                                            )}
                                    </div>
                                </div>

                                <div className="shift-info-grid">
                                    <div className="info-item">
                                        <ClockCircleOutlined className="info-icon" />
                                        <div>
                                            <Text type="secondary" className="info-label">
                                                Working Hours
                                            </Text>
                                            <Text strong className="info-value">
                                                {assignment.shiftType?.fromTime} -{" "}
                                                {assignment.shiftType?.toTime}
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <CalendarOutlined className="info-icon" />
                                        <div>
                                            <Text type="secondary" className="info-label">
                                                Assignment Period
                                            </Text>
                                            <Text strong className="info-value">
                                                {dayjs(assignment.fromDate).format(
                                                    "DD/MM"
                                                )}{" "}
                                                -{" "}
                                                {dayjs(assignment.toDate).format(
                                                    "DD/MM/YYYY"
                                                )}
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <InfoCircleOutlined className="info-icon" />
                                        <div>
                                            <Text type="secondary" className="info-label">
                                                Late Tolerance
                                            </Text>
                                            <Text strong className="info-value">
                                                {assignment.shiftType
                                                    ?.allowedLateMinute || 0}{" "}
                                                minutes
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="info-item">
                                        <InfoCircleOutlined className="info-icon" />
                                        <div>
                                            <Text type="secondary" className="info-label">
                                                Early Leave Tolerance
                                            </Text>
                                            <Text strong className="info-value">
                                                {assignment.shiftType
                                                    ?.allowedEarlyLeaveMinute || 0}{" "}
                                                minutes
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                {assignment.shiftType?.description && (
                                    <div className="shift-description">
                                        <Text type="secondary">
                                            <strong>Note:</strong>{" "}
                                            {assignment.shiftType.description}
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
};

export default ShiftDetailsModal;