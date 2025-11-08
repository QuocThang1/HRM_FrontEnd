import { Modal, Descriptions, Typography, Tag, Space } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Paragraph } = Typography;

const ResignationDetailModalAdmin = ({ visible, onClose, resignation }) => {
    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: "processing", icon: <ClockCircleOutlined />, text: "Pending" },
            approved: { color: "success", icon: <CheckCircleOutlined />, text: "Approved" },
            rejected: { color: "error", icon: <CloseCircleOutlined />, text: "Rejected" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
    };

    if (!resignation) return null;

    return (
        <Modal
            title="Resignation Details"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Staff">
                    <Space direction="vertical" size={0}>
                        <Text strong>
                            {resignation.staffId?.personalInfo?.fullName || "N/A"}
                        </Text>
                        <Text type="secondary">
                            {resignation.staffId?.personalInfo?.email || ""}
                        </Text>
                        <Text type="secondary">
                            Role: {resignation.staffId?.role?.toUpperCase() || ""}
                        </Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    {getStatusTag(resignation.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Submitted Date">
                    {dayjs(resignation.submittedAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                {resignation.processedAt && (
                    <Descriptions.Item label="Processed Date">
                        {dayjs(resignation.processedAt).format("DD/MM/YYYY HH:mm")}
                    </Descriptions.Item>
                )}
                <Descriptions.Item label="Reason">
                    <Paragraph style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                        {resignation.reason}
                    </Paragraph>
                </Descriptions.Item>
                {resignation.adminNote && (
                    <Descriptions.Item label="Admin Note">
                        <Paragraph
                            style={{
                                whiteSpace: "pre-wrap",
                                margin: 0,
                                padding: 12,
                                background: "#f5f5f5",
                                borderRadius: 4,
                            }}
                        >
                            {resignation.adminNote}
                        </Paragraph>
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Modal>
    );
};

export default ResignationDetailModalAdmin;