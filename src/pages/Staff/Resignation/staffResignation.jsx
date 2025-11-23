import { useState, useEffect, useContext } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Select,
    Space,
    Typography,
    Row,
    Col,
    Alert,
    Descriptions,
    Tag,
    Modal
} from "antd";
import {
    FileTextOutlined,
    SendOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import {
    submitResignationApi,
    getMyResignationsApi,
    deleteResignationApi,
} from "../../../utils/Api/resignationApi";
import { getStaffApi } from "../../../utils/Api/staffApi";
import { AuthContext } from "../../../context/auth.context";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "../../../styles/resignation.css";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StaffResignationPage = () => {
    const { auth } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [resignation, setResignation] = useState(null);
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        fetchMyResignation();
        fetchAdmins();
    }, []);

    const fetchMyResignation = async () => {
        try {
            setLoading(true);
            const res = await getMyResignationsApi();
            console.log("Fetched resignation:", res);
            if (res && res.data && res.data.length > 0) {
                setResignation(res.data[0]);
            }
        } catch (error) {
            toast.error("Failed to fetch resignation",)
            console.error("Error fetching resignation:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await getStaffApi("admin");
            if (res && res.data) {
                setAdmins(res.data);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);
            const res = await submitResignationApi(values.reason, values.approvedBy);

            if (res && res.EC === 0) {
                toast.success(res.EM || "Resignation submitted successfully");
                form.resetFields();
                fetchMyResignation();
            } else {
                toast.error(res?.EM || "Failed to submit resignation");
            }
        } catch (error) {
            console.error("Error submitting resignation:", error);
            toast.error("An error occurred while submitting");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: "Are you sure you want to delete this resignation?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    const res = await deleteResignationApi(resignation._id);
                    if (res && res.EC === 0) {
                        toast.success(res.EM || "Resignation deleted successfully");
                        setResignation(null);
                    } else {
                        toast.error(res?.EM || "Failed to delete resignation");
                    }
                } catch (error) {
                    console.error("Error deleting resignation:", error);
                    toast.error("An error occurred while deleting");
                }
            },
        });
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: "processing", icon: <ClockCircleOutlined />, text: "Pending" },
            approved: { color: "success", icon: <CheckCircleOutlined />, text: "Approved" },
            rejected: { color: "error", icon: <CloseCircleOutlined />, text: "Rejected" },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Tag color={config.color} icon={config.icon} style={{ fontSize: '14px', padding: '4px 12px' }}>
                {config.text}
            </Tag>
        );
    };

    return (
        <div className="resignation-page">
            <div className="page-header">
                <div className="page-title">
                    <FileTextOutlined /> Resignation Request
                </div>
                <div className="page-subtitle">
                    Submit and track your resignation request
                </div>
            </div>

            {/* Existing Resignation Status */}
            {resignation ? (
                <Card
                    className="status-card"
                    title="Your Resignation Status"
                    bordered={false}
                    loading={loading}
                >
                    <Alert
                        message={
                            resignation.status === "pending"
                                ? "Your resignation is pending approval"
                                : resignation.status === "approved"
                                    ? "Your resignation has been approved"
                                    : "Your resignation has been rejected"
                        }
                        description={
                            resignation.status === "pending"
                                ? "Please wait for the administrator to review your request."
                                : resignation.status === "approved"
                                    ? "Your resignation has been approved. Please follow the exit process."
                                    : "Your resignation has been rejected. You can submit a new request."
                        }
                        type={
                            resignation.status === "pending"
                                ? "info"
                                : resignation.status === "approved"
                                    ? "success"
                                    : "error"
                        }
                        showIcon
                        icon={
                            resignation.status === "pending"
                                ? <ClockCircleOutlined />
                                : resignation.status === "approved"
                                    ? <CheckCircleOutlined />
                                    : <CloseCircleOutlined />
                        }
                        style={{ marginBottom: 24 }}
                    />

                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Status">
                            {getStatusTag(resignation.status)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Submitted Date">
                            {dayjs(resignation.submittedAt).format("DD/MM/YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Approver">
                            {resignation.approvedBy?.personalInfo?.fullName || "N/A"}
                            <br />
                            <Text type="secondary">
                                {resignation.approvedBy?.personalInfo?.email || ""}
                            </Text>
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
                                        borderRadius: 4
                                    }}
                                >
                                    {resignation.adminNote}
                                </Paragraph>
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    {resignation.status === "pending" && (
                        <div style={{ marginTop: 16, textAlign: "right" }}>
                            <Button danger onClick={handleDelete}>
                                Delete Request
                            </Button>
                        </div>
                    )}

                    {resignation.status === "rejected" && (
                        <Alert
                            message="You can submit a new resignation request"
                            type="warning"
                            showIcon
                            style={{ marginTop: 16 }}
                            action={
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => setResignation(null)}
                                >
                                    Submit New Request
                                </Button>
                            }
                        />
                    )}
                </Card>
            ) : (
                /* Submit Form */
                <Card className="form-card" title="Submit Resignation Request" bordered={false}>
                    <Alert
                        message="Important Notice"
                        description="Once submitted, you can only delete your resignation while it's pending. Please make sure all information is correct before submitting."
                        type="info"
                        showIcon
                        icon={<InfoCircleOutlined />}
                        style={{ marginBottom: 24 }}
                    />

                    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <Row gutter={16}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label="Select Approver (Admin)"
                                    name="approvedBy"
                                    rules={[{ required: true, message: "Please select an approver" }]}
                                >
                                    <Select
                                        placeholder="Select admin to approve"
                                        size="large"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children.props?.children[1]?.toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        {admins.map((admin) => (
                                            <Option key={admin._id} value={admin._id}>
                                                <Space>
                                                    <UserOutlined />
                                                    {admin.personalInfo?.fullName} - {admin.personalInfo?.email}
                                                </Space>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item label="Current Role">
                                    <Input
                                        size="large"
                                        value={auth?.staff?.role?.toUpperCase()}
                                        disabled
                                        prefix={<UserOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Reason for Resignation"
                            name="reason"
                            rules={[
                                { required: true, message: "Please provide a reason" },
                                { min: 4, message: "Reason must be at least 4 characters" },
                                { max: 1000, message: "Reason must not exceed 1000 characters" },
                            ]}
                        >
                            <TextArea
                                rows={6}
                                placeholder="Please explain your reason for resignation..."
                                showCount
                                maxLength={1000}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SendOutlined />}
                                loading={submitting}
                                size="large"
                                block
                            >
                                Submit Resignation
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default StaffResignationPage;