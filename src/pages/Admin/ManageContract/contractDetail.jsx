import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    Button,
    Tag,
    Spin,
    Typography,
    Space,
    Divider,
    Descriptions,
} from "antd";
import {
    ArrowLeftOutlined,
    CalendarOutlined,
    UserOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { getContractByIdApi } from "../../../utils/Api/contractApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const ContractDetail = () => {
    const { contractId } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchContract();
    }, [contractId]);

    const fetchContract = async () => {
        try {
            setLoading(true);
            const res = await getContractByIdApi(contractId);
            if (res.EC === 0 && res.data) {
                setContract(res.data);
            } else {
                toast.error("Contract not found");
                navigate(-1);
            }
        } catch (error) {
            console.error("Error fetching contract:", error);
            toast.error("Failed to load contract");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="contract-detail-loading">
                <Spin size="large" tip="Loading contract..." />
            </div>
        );
    }

    if (!contract) {
        return null;
    }

    const durationMonths = dayjs(contract.toDate).diff(
        dayjs(contract.fromDate),
        "month"
    );

    return (
        <div className="contract-detail-page">
            <div className="contract-detail-header">
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    size="large"
                >
                    Back
                </Button>
            </div>

            <Card className="contract-detail-card">
                {/* Header */}
                <div className="contract-header">
                    <Space direction="vertical" size={16} style={{ width: "100%" }}>
                        <Tag
                            color={contract.status === "active" ? "success" : "error"}
                            style={{ fontSize: "14px", padding: "4px 12px" }}
                        >
                            {contract.status?.toUpperCase()}
                        </Tag>

                        <Title level={1} className="contract-title">
                            Employment Contract
                        </Title>

                        <Descriptions column={1} bordered>
                            <Descriptions.Item
                                label={
                                    <Space>
                                        <UserOutlined style={{ color: "#1890ff" }} />
                                        <Text strong>Staff Information</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" size={4}>
                                    <Text strong style={{ fontSize: 16 }}>
                                        {contract.staffId?.personalInfo?.fullName || "N/A"}
                                    </Text>
                                    <Text type="secondary">
                                        {contract.staffId?.personalInfo?.email || "N/A"}
                                    </Text>
                                    <Space>
                                        <Tag color="blue">
                                            {contract.staffId?.departmentId
                                                ?.departmentName || "No Department"}
                                        </Tag>
                                        <Tag
                                            color={
                                                contract.staffId?.role === "manager"
                                                    ? "gold"
                                                    : "green"
                                            }
                                        >
                                            {contract.staffId?.role?.toUpperCase()}
                                        </Tag>
                                    </Space>
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={
                                    <Space>
                                        <CalendarOutlined style={{ color: "#1890ff" }} />
                                        <Text strong>Contract Period</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" size={4}>
                                    <Space>
                                        <Text strong>From:</Text>
                                        <Text>
                                            {dayjs(contract.fromDate).format(
                                                "DD MMMM YYYY"
                                            )}
                                        </Text>
                                    </Space>
                                    <Space>
                                        <Text strong>To:</Text>
                                        <Text>
                                            {dayjs(contract.toDate).format("DD MMMM YYYY")}
                                        </Text>
                                    </Space>
                                    <Space>
                                        <Text strong>Duration:</Text>
                                        <Tag color="blue">{durationMonths} months</Tag>
                                    </Space>
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item
                                label={
                                    <Space>
                                        <ClockCircleOutlined style={{ color: "#1890ff" }} />
                                        <Text strong>Created Information</Text>
                                    </Space>
                                }
                            >
                                <Space direction="vertical" size={4}>
                                    <Space>
                                        <Text strong>Created By:</Text>
                                        <Text>
                                            {contract.createdBy?.personalInfo?.fullName ||
                                                "N/A"}
                                        </Text>
                                    </Space>
                                    <Space>
                                        <Text strong>Created At:</Text>
                                        <Text>
                                            {dayjs(contract.createdAt).format(
                                                "DD/MM/YYYY HH:mm"
                                            )}
                                        </Text>
                                    </Space>
                                    {contract.updatedAt &&
                                        contract.updatedAt !== contract.createdAt && (
                                            <Space>
                                                <Text strong>Last Updated:</Text>
                                                <Text>
                                                    {dayjs(contract.updatedAt).format(
                                                        "DD/MM/YYYY HH:mm"
                                                    )}
                                                </Text>
                                            </Space>
                                        )}
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Space>
                </div>

                <Divider />

                {/* Content */}
                <div className="contract-content">
                    <Title level={3} style={{ marginBottom: 16 }}>
                        Contract Terms & Conditions
                    </Title>
                    <Paragraph
                        style={{
                            fontSize: "16px",
                            lineHeight: "1.8",
                            whiteSpace: "pre-wrap",
                            color: "#262626",
                            textAlign: "justify",
                        }}
                    >
                        {contract.content}
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default ContractDetail;