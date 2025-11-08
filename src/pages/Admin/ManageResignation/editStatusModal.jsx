import { Modal, Form, Select, Input, Button, Space, Descriptions, Typography, Tag } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const EditStatusModal = ({ visible, onClose, resignation, onSubmit, form }) => {
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

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    if (!resignation) return null;

    return (
        <Modal
            title="Update Resignation Status"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
        >
            <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Staff">
                    <Space direction="vertical" size={0}>
                        <Text strong>
                            {resignation.staffId?.personalInfo?.fullName || "N/A"}
                        </Text>
                        <Text type="secondary">
                            {resignation.staffId?.personalInfo?.email || ""}
                        </Text>
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Current Status">
                    {getStatusTag(resignation.status)}
                </Descriptions.Item>
            </Descriptions>

            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    label="New Status"
                    name="status"
                    rules={[{ required: true, message: "Please select a status" }]}
                >
                    <Select size="large">
                        <Option value="pending">
                            <Space>
                                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                                Pending
                            </Space>
                        </Option>
                        <Option value="approved">
                            <Space>
                                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                                Approved
                            </Space>
                        </Option>
                        <Option value="rejected">
                            <Space>
                                <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                                Rejected
                            </Space>
                        </Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Admin Note"
                    name="adminNote"
                    rules={[
                        { max: 500, message: "Note must not exceed 500 characters" },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Add a note for this resignation (optional)"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                    <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            Update Status
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditStatusModal;