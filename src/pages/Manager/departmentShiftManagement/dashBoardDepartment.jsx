
import { useState, useEffect } from "react";
import {
    Card,
    Typography,
    Spin,
    Empty,
    Tag,
    Avatar,
    Row,
    Col,
    Statistic,
} from "antd";
import {
    UserOutlined,
    CrownOutlined,
    PhoneOutlined,
    MailOutlined,
    TeamOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { getManagerDepartmentApi } from "../../../utils/Api/departmentApi";
import { getStaffByDepartmentApi } from "../../../utils/Api/staffApi";
import DepartmentScheduleTable from "../../../components/departmentScheduleTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../../styles/managerDepartment.css";

const { Title, Text } = Typography;

const ManagerDepartmentPage = () => {
    const [department, setDepartment] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [staffLoading, setStaffLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchManagerDepartment();
    }, []);

    const fetchManagerDepartment = async () => {
        try {
            setLoading(true);
            const res = await getManagerDepartmentApi();
            if (res.data) {
                setDepartment(res.data);
                // Sau khi có department ID, lấy danh sách staff
                if (res.data._id) {
                    await fetchStaffList(res.data._id);
                }
            } else {
                toast.error(
                    res?.EM || "You are not managing any department",
                    {
                        autoClose: 2000,
                    }
                );
            }
        } catch (error) {
            console.error("Error fetching department:", error);
            toast.error("Cannot fetch department from server", {
                autoClose: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffList = async (departmentId) => {
        try {
            setStaffLoading(true);
            const res = await getStaffByDepartmentApi(departmentId);
            if (res && Array.isArray(res.data)) {
                setStaffList(res.data);
            } else {
                toast.error(res?.EM || "Failed to fetch staff list", {
                    autoClose: 2000,
                });
                setStaffList([]);
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("Cannot fetch staff from server", { autoClose: 2000 });
            setStaffList([]);
        } finally {
            setStaffLoading(false);
        }
    };

    const isManager = (staff) => {
        return staff._id === department?.managerId?._id || staff._id === department?.managerId;
    };

    const getAvatarColor = (name) => {
        const colors = [
            "#f56a00",
            "#7265e6",
            "#ffbf00",
            "#00a2ae",
            "#87d068",
        ];
        const index = name?.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (loading) {
        return (
            <div className="manager-department-page">
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (!department) {
        return (
            <div className="manager-department-page">
                <div className="page-header">
                    <div className="header-content">
                        <Title level={2} className="page-title">
                            My Department
                        </Title>
                    </div>
                </div>
                <div className="content-wrapper">
                    <Card>
                        <Empty description="You are not managing any department" />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="manager-department-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <Title level={2} className="page-title">
                        My Department
                    </Title>
                    <div className="dept-header-info">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                            <div>
                                <Title level={3} className="dept-title">
                                    {department.departmentName}
                                </Title>
                                {department.description && (
                                    <Text className="dept-subtitle">
                                        {department.description}
                                    </Text>
                                )}
                            </div>
                            <button
                                className="shift-management-btn"
                                onClick={() => navigate(`/profile/department-shift-management/${department._id}`)}
                            >
                                <ClockCircleOutlined />
                                <span>Manage Shifts</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="content-wrapper">
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="stat-card">
                            <Statistic
                                title="Total Staff"
                                value={staffList.length}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: "#667eea" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="stat-card">
                            <Statistic
                                title="Department Manager"
                                value={
                                    department.managerId?.personalInfo
                                        ?.fullName || "N/A"
                                }
                                prefix={<CrownOutlined />}
                                valueStyle={{ color: "#faad14", fontSize: 20 }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="stat-card">
                            <Statistic
                                title="Regular Staff"
                                value={
                                    staffList.filter(
                                        (s) => s.role === "staff"
                                    ).length
                                }
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Staff List */}
                <Card
                    title={
                        <div className="card-title">
                            <UserOutlined className="title-icon" />
                            <span>Staff Members</span>
                            <Tag color="blue">{staffList.length}</Tag>
                        </div>
                    }
                    className="staff-card"
                >
                    {staffLoading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                        </div>
                    ) : staffList.length === 0 ? (
                        <Empty description="No staff in this department" />
                    ) : (
                        <Row gutter={[24, 24]}>
                            {staffList.map((staff) => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                    xl={4}
                                    key={staff._id}
                                >
                                    <Card
                                        className={`staff-item-card ${isManager(staff) ? "manager" : ""
                                            }`}
                                        hoverable={staff.role === "staff"}
                                        onClick={() => {
                                            if (staff.role === "staff") {
                                                navigate(`/profile/staff-shift-assignment/${staff._id}`);
                                            }
                                        }}
                                        style={{
                                            cursor: staff.role === "staff" ? 'pointer' : 'default'
                                        }}
                                    >
                                        {isManager(staff) && (
                                            <div className="manager-badge">
                                                <CrownOutlined />
                                                <span>Manager</span>
                                            </div>
                                        )}

                                        <div className="staff-avatar-wrapper">
                                            <Avatar
                                                size={80}
                                                style={{
                                                    backgroundColor:
                                                        getAvatarColor(
                                                            staff.personalInfo
                                                                ?.fullName
                                                        ),
                                                }}
                                                className="staff-avatar"
                                            >
                                                {staff.personalInfo?.fullName
                                                    ?.charAt(0)
                                                    .toUpperCase() || "?"}
                                            </Avatar>
                                        </div>

                                        <div className="staff-info">
                                            <Title
                                                level={5}
                                                className="staff-name"
                                            >
                                                {staff.personalInfo?.fullName ||
                                                    "N/A"}
                                            </Title>

                                            <Tag
                                                color={
                                                    staff.role === "admin"
                                                        ? "red"
                                                        : staff.role ===
                                                            "manager"
                                                            ? "orange"
                                                            : "blue"
                                                }
                                                className="role-tag"
                                            >
                                                {staff.role?.toUpperCase()}
                                            </Tag>

                                            <div className="contact-info">
                                                {staff.personalInfo?.email && (
                                                    <div className="contact-item">
                                                        <MailOutlined className="contact-icon" />
                                                        <Text
                                                            className="contact-text"
                                                            ellipsis
                                                        >
                                                            {
                                                                staff
                                                                    .personalInfo
                                                                    .email
                                                            }
                                                        </Text>
                                                    </div>
                                                )}

                                                {staff.personalInfo
                                                    ?.phoneNumber && (
                                                        <div className="contact-item">
                                                            <PhoneOutlined className="contact-icon" />
                                                            <Text className="contact-text">
                                                                {
                                                                    staff
                                                                        .personalInfo
                                                                        .phoneNumber
                                                                }
                                                            </Text>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Card>
                <DepartmentScheduleTable
                    departmentId={department._id}
                    staffList={staffList}
                />
            </div>
        </div>
    );
};

export default ManagerDepartmentPage;
