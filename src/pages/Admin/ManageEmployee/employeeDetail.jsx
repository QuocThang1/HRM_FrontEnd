import { useState, useEffect } from "react";
import {
    Card,
    Descriptions,
    Button,
    Space,
    Typography,
    Tag,
    Row,
    Col,
    Spin,
    Avatar,
    Statistic,
    Timeline,
    Empty,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    IdcardOutlined,
    CalendarOutlined,
    ManOutlined,
    WomanOutlined,
    DollarOutlined,
    ArrowLeftOutlined,
    EditOutlined,
    TeamOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
    CrownOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { detailStaffApi } from "../../../utils/Api/staffApi";
import { getSalaryByStaffApi } from "../../../utils/Api/salaryApi";
import { getAllContractsApi } from "../../../utils/Api/contractApi";
import { getAllAttendancesApi } from "../../../utils/Api/attendanceAPI";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../../../styles/employeeDetail.css";

const { Title, Text } = Typography;

const EmployeeDetail = () => {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState(null);
    const [salary, setSalary] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [attendances, setAttendances] = useState([]);

    useEffect(() => {
        fetchEmployeeData();
    }, [staffId]);

    const fetchEmployeeData = async () => {
        try {
            setLoading(true);

            // Fetch staff details
            const staffRes = await detailStaffApi(staffId);
            if (staffRes && staffRes.EC === 0 && staffRes.data) {
                setStaff(staffRes.data);
            } else {
                toast.error(staffRes?.EM || "Failed to fetch employee details");
                return;
            }

            // Fetch salary
            try {
                const salaryRes = await getSalaryByStaffApi(staffId);
                if (salaryRes && salaryRes.EC === 0 && salaryRes.data) {
                    setSalary(salaryRes.data);
                }
            } catch (error) {
                console.log("No salary data found for this employee");
            }

            // Fetch contracts
            try {
                const contractsRes = await getAllContractsApi();
                console.log("Contracts Response:", contractsRes);
                if (contractsRes && contractsRes.EC === 0 && contractsRes.data) {
                    const staffContracts = contractsRes.data.filter(
                        (contract) =>
                            contract.staffId?._id === staffId || contract.staffId === staffId
                    );
                    setContracts(staffContracts);
                }
            } catch (error) {
                console.log("No contracts found for this employee");
            }

            // Fetch recent attendances (last 30 days)
            try {
                const endDate = dayjs();
                const startDate = endDate.subtract(30, "days");
                const attendanceRes = await getAllAttendancesApi(
                    startDate.format("YYYY-MM-DD"),
                    endDate.format("YYYY-MM-DD")
                );
                if (attendanceRes && attendanceRes.EC === 0 && attendanceRes.data) {
                    const staffAttendances = attendanceRes.data.filter(
                        (att) => att.staffId?._id === staffId || att.staffId === staffId
                    );
                    setAttendances(staffAttendances);
                }
            } catch (error) {
                console.log("No attendance data found for this employee");
            }
        } catch (error) {
            console.error("Error fetching employee data:", error);
            toast.error("An error occurred while fetching employee details");
        } finally {
            setLoading(false);
        }
    };

    const getRoleTag = (role) => {
        const roleConfig = {
            admin: {
                color: "#ff4d4f",
                icon: <SafetyCertificateOutlined />,
                text: "ADMIN",
            },
            manager: { color: "#1890ff", icon: <CrownOutlined />, text: "MANAGER" },
            staff: { color: "#52c41a", icon: <UserOutlined />, text: "STAFF" },
        };
        const config = roleConfig[role] || roleConfig.staff;
        return (
            <Tag color={config.color} icon={config.icon} style={{ fontSize: 14 }}>
                {config.text}
            </Tag>
        );
    };

    const getGenderIcon = (gender) => {
        if (gender === "male") return <ManOutlined style={{ color: "#1890ff" }} />;
        if (gender === "female")
            return <WomanOutlined style={{ color: "#eb2f96" }} />;
        return <UserOutlined />;
    };

    const getContractStatus = (contract) => {
        const endDate = dayjs(contract.toDate);
        const today = dayjs();
        const daysUntilExpiry = endDate.diff(today, "days");

        if (contract.status === "expired") {
            return <Tag color="red">Expired</Tag>;
        }
        if (daysUntilExpiry <= 30) {
            return <Tag color="orange">Expiring Soon ({daysUntilExpiry} days)</Tag>;
        }
        return <Tag color="green">Active</Tag>;
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }}
            >
                <Spin size="large" tip="Loading employee details..." />
            </div>
        );
    }

    if (!staff) {
        return (
            <div style={{ padding: "24px" }}>
                <Empty description="Employee not found" />
            </div>
        );
    }

    return (
        <div className="employee-detail-page">
            {/* Header */}
            <div className="page-header">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/profile/employee-management")}
                    size="large"
                    className="back-button"
                >
                    Back to Employees
                </Button>
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="large"
                        onClick={() => navigate(`/profile/salary-management/${staffId}`)}
                    >
                        Manage Salary
                    </Button>
                </Space>
            </div>

            {/* Profile Card */}
            <Card className="profile-card">
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8} style={{ textAlign: "center" }}>
                        <Avatar
                            size={150}
                            icon={<UserOutlined />}
                            className="profile-avatar"
                        />
                        <Title level={3} style={{ margin: "16px 0 8px" }}>
                            {staff.personalInfo?.fullName || "N/A"}
                        </Title>
                        <div>{getRoleTag(staff.role)}</div>
                    </Col>

                    <Col xs={24} md={16}>
                        <Descriptions
                            title="Personal Information"
                            column={1}
                            bordered
                            size="middle"
                        >
                            <Descriptions.Item
                                label={
                                    <Space>
                                        <MailOutlined /> Email
                                    </Space>
                                }
                            >
                                {staff.personalInfo?.email || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space>
                                        <PhoneOutlined /> Phone
                                    </Space>
                                }
                            >
                                {staff.personalInfo?.phone || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space>
                                        <IdcardOutlined /> Citizen ID
                                    </Space>
                                }
                            >
                                {staff.personalInfo?.citizenId || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space>
                                        <CalendarOutlined /> Date of Birth
                                    </Space>
                                }
                            >
                                {staff.personalInfo?.dob
                                    ? dayjs(staff.personalInfo.dob).format("DD/MM/YYYY")
                                    : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space>
                                        {getGenderIcon(staff.personalInfo?.gender)} Gender
                                    </Space>
                                }
                            >
                                {staff.personalInfo?.gender?.toUpperCase() || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space>
                                        <HomeOutlined /> Address
                                    </Space>
                                }
                            >
                                {staff.personalInfo?.address || "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            {/* Stats Row */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Hourly Rate"
                            value={salary?.hourlyRate || 0}
                            prefix={<DollarOutlined />}
                            suffix="/hour"
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Department"
                            value={staff.departmentId?.departmentName || "Not Assigned"}
                            prefix={<TeamOutlined />}
                            valueStyle={{ fontSize: 18 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Active Contracts"
                            value={contracts.filter((c) => c.status === "active").length || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="Attendance (30 days)"
                            value={attendances.length}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Additional Details */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                {/* Employment Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <FileTextOutlined />
                                <span>Employment Information</span>
                            </Space>
                        }
                        className="info-card"
                    >
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Role">
                                {staff.role || "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Base Salary">
                                {salary?.hourlyRate ? (
                                    <Space>
                                        <DollarOutlined style={{ color: "#52c41a" }} />
                                        <Text strong style={{ color: "#52c41a" }}>
                                            ${salary.hourlyRate.toLocaleString()}/hour
                                        </Text>
                                    </Space>
                                ) : (
                                    <Tag color="orange">Not Set</Tag>
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Contract History */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <FileTextOutlined />
                                <span>Contract History</span>
                            </Space>
                        }
                        className="info-card"
                    >
                        {contracts.length > 0 ? (
                            <Timeline
                                items={contracts.map((contract) => ({
                                    color:
                                        contract.status === "active"
                                            ? "green"
                                            : contract.status === "expired"
                                                ? "red"
                                                : "blue",
                                    children: (
                                        <div>
                                            <Space direction="vertical" size={4}>
                                                <Space>
                                                    <Text strong>Labor Contract</Text>
                                                    {getContractStatus(contract)}
                                                </Space>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {dayjs(contract.fromDate).format("DD/MM/YYYY")} -{" "}
                                                    {dayjs(contract.toDate).format("DD/MM/YYYY")}
                                                </Text>
                                            </Space>
                                        </div>
                                    ),
                                }))}
                            />
                        ) : (
                            <Empty description="No contract history" />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Recent Attendance */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card
                        title={
                            <Space>
                                <ClockCircleOutlined />
                                <span>Recent Attendance (Last 30 Days)</span>
                            </Space>
                        }
                        className="info-card"
                    >
                        {attendances.length > 0 ? (
                            <Timeline
                                items={attendances.slice(0, 10).map((att) => ({
                                    color: att.isLate ? "red" : "green",
                                    children: (
                                        <div>
                                            <Space direction="vertical" size={4}>
                                                <Space>
                                                    <Text strong>
                                                        {dayjs(att.checkIn).format("DD/MM/YYYY")}
                                                    </Text>
                                                    {att.isLate && (
                                                        <Tag color="red">Late ({att.lateMinutes} min)</Tag>
                                                    )}
                                                </Space>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Check-in:{" "}
                                                    {att.checkIn
                                                        ? dayjs(att.checkIn).format("HH:mm")
                                                        : "N/A"}{" "}
                                                    | Check-out:{" "}
                                                    {att.checkOut
                                                        ? dayjs(att.checkOut).format("HH:mm")
                                                        : "N/A"}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Working Hours: {att.workingHours || 0} hours
                                                </Text>
                                            </Space>
                                        </div>
                                    ),
                                }))}
                            />
                        ) : (
                            <Empty description="No attendance records in the last 30 days" />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EmployeeDetail;