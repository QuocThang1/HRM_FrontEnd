import { useState, useEffect } from "react";
import {
    Card,
    Table,
    Typography,
    Spin,
    Tag,
    DatePicker,
    Space,
    Empty,
    Avatar,
    Statistic,
    Row,
    Col,
} from "antd";
import {
    CalendarOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    WarningOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { getManagerDepartmentApi } from "../../../utils/Api/departmentApi";
import { getAttendancesByDepartmentApi } from "../../../utils/Api/attendanceAPI";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../../../styles/managerAttendanceManagement.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ManagerAttendanceManagement = () => {
    const [department, setDepartment] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState([
        dayjs().startOf("month"),
        dayjs().endOf("month"),
    ]);

    useEffect(() => {
        fetchManagerDepartment();
    }, []);

    useEffect(() => {
        if (department?._id) {
            fetchAttendances();
        }
    }, [department, dateRange]);

    const fetchManagerDepartment = async () => {
        try {
            const res = await getManagerDepartmentApi();
            if (res.data) {
                setDepartment(res.data);
            } else {
                toast.error(res?.EM || "You are not managing any department", {
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Error fetching department:", error);
            toast.error("Cannot fetch department from server", {
                autoClose: 2000,
            });
        }
    };

    const fetchAttendances = async () => {
        try {
            setLoading(true);
            const startDate = dateRange[0].format("YYYY-MM-DD");
            const endDate = dateRange[1].format("YYYY-MM-DD");

            const res = await getAttendancesByDepartmentApi(
                department._id,
                startDate,
                endDate
            );
            console.log("Attendances Response:", res);

            if (res && Array.isArray(res.data)) {
                setAttendances(res.data);
            } else {
                setAttendances([]);
            }
        } catch (error) {
            console.error("Error fetching attendances:", error);
            toast.error("Failed to load attendance records", {
                autoClose: 2000,
            });
            setAttendances([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeChange = (dates) => {
        if (dates && dates[0] && dates[1]) {
            setDateRange(dates);
        }
    };

    const getAvatarColor = (name) => {
        const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068"];
        const index = name?.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Statistics
    const totalAttendances = attendances.length;
    const presentCount = attendances.filter(
        (a) => a.checkIn && !a.isLate
    ).length;
    const lateCount = attendances.filter((a) => a.isLate).length;
    const totalWorkingHours = attendances
        .reduce((sum, a) => sum + (a.workingHours || 0), 0)
        .toFixed(2);

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 120,
            fixed: "left",
            sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
            render: (date) => (
                <div className="date-cell">
                    <CalendarOutlined className="date-icon" />
                    <div>
                        <div className="date-day">
                            {dayjs(date).format("DD MMM")}
                        </div>
                        <div className="date-weekday">
                            {dayjs(date).format("ddd")}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Staff",
            key: "staff",
            width: 200,
            fixed: "left",
            render: (_, record) => {
                const staff = record.staffId;
                return (
                    <div className="staff-cell">
                        <Avatar
                            size={40}
                            style={{
                                backgroundColor: getAvatarColor(
                                    staff?.personalInfo?.fullName
                                ),
                            }}
                        >
                            {staff?.personalInfo?.fullName
                                ?.charAt(0)
                                .toUpperCase() || "?"}
                        </Avatar>
                        <div className="staff-info">
                            <Text strong className="staff-name">
                                {staff?.personalInfo?.fullName || "N/A"}
                            </Text>
                            <Text type="secondary" className="staff-email">
                                {staff?.personalInfo?.email || ""}
                            </Text>
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Check In",
            dataIndex: "checkIn",
            key: "checkIn",
            width: 150,
            render: (checkIn) => (
                <div className="time-cell">
                    {checkIn ? (
                        <>
                            <ClockCircleOutlined className="time-icon" />
                            <Text strong>{dayjs(checkIn).format("HH:mm:ss")}</Text>
                        </>
                    ) : (
                        <Text type="secondary">-</Text>
                    )}
                </div>
            ),
        },
        {
            title: "Check Out",
            dataIndex: "checkOut",
            key: "checkOut",
            width: 150,
            render: (checkOut) => (
                <div className="time-cell">
                    {checkOut ? (
                        <>
                            <ClockCircleOutlined className="time-icon" />
                            <Text strong>{dayjs(checkOut).format("HH:mm:ss")}</Text>
                        </>
                    ) : (
                        <Text type="secondary">-</Text>
                    )}
                </div>
            ),
        },
        {
            title: "Working Hours",
            dataIndex: "workingHours",
            key: "workingHours",
            width: 130,
            align: "center",
            sorter: (a, b) => (a.workingHours || 0) - (b.workingHours || 0),
            render: (hours) => (
                <Tag color="blue" className="hours-tag">
                    {hours ? `${hours} hrs` : "0 hrs"}
                </Tag>
            ),
        },
        {
            title: "Late",
            key: "late",
            width: 120,
            align: "center",
            render: (_, record) =>
                record.isLate ? (
                    <Tag color="orange" icon={<WarningOutlined />}>
                        {record.lateMinutes} min
                    </Tag>
                ) : (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                        On Time
                    </Tag>
                ),
        },
        {
            title: "Early Leave",
            key: "earlyLeave",
            width: 130,
            align: "center",
            render: (_, record) =>
                record.isEarlyLeave ? (
                    <Tag color="orange" icon={<WarningOutlined />}>
                        {record.earlyLeaveMinutes} min
                    </Tag>
                ) : record.checkOut ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                        Normal
                    </Tag>
                ) : (
                    <Text type="secondary">-</Text>
                ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            width: 200,
            ellipsis: true,
            render: (location) => (
                <Text type="secondary" ellipsis>
                    {location || "N/A"}
                </Text>
            ),
        },
    ];

    if (!department) {
        return (
            <div className="manager-attendance-page">
                <div className="page-header">
                    <div className="header-content">
                        <Title level={2} className="page-title">
                            Attendance Management
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
        <div className="manager-attendance-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title-section">
                        <CalendarOutlined className="header-icon" />
                        <div>
                            <Title level={2} className="page-title">
                                Attendance Management
                            </Title>
                            <Text className="page-subtitle">
                                {department.departmentName} Department
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="content-wrapper">
                {/* Statistics Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="stat-card total">
                            <Statistic
                                title="Total Records"
                                value={totalAttendances}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: "#667eea" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="stat-card present">
                            <Statistic
                                title="On Time"
                                value={presentCount}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="stat-card late">
                            <Statistic
                                title="Late Arrivals"
                                value={lateCount}
                                prefix={<WarningOutlined />}
                                valueStyle={{ color: "#faad14" }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="stat-card hours">
                            <Statistic
                                title="Total Hours"
                                value={totalWorkingHours}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                                suffix="hrs"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Attendance Table */}
                <Card
                    title={
                        <div className="card-title">
                            <UserOutlined className="title-icon" />
                            <span>Attendance Records</span>
                        </div>
                    }
                    extra={
                        <Space>
                            <RangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                                format="DD/MM/YYYY"
                                allowClear={false}
                            />
                        </Space>
                    }
                    className="attendance-table-card"
                >
                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                        </div>
                    ) : attendances.length === 0 ? (
                        <Empty
                            description="No attendance records found"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={attendances}
                            rowKey="_id"
                            scroll={{ x: 1400 }}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} records`,
                            }}
                            className="attendance-table"
                        />
                    )}
                </Card>

                {/* Legend */}
                <Card className="legend-card">
                    <div className="legend-content">
                        <Text strong>Legend:</Text>
                        <div className="legend-items">
                            <div className="legend-item">
                                <Tag color="success" icon={<CheckCircleOutlined />}>
                                    On Time
                                </Tag>
                                <Text type="secondary">
                                    Arrived within allowed time
                                </Text>
                            </div>
                            <div className="legend-item">
                                <Tag color="orange" icon={<WarningOutlined />}>
                                    Late
                                </Tag>
                                <Text type="secondary">
                                    Arrived after allowed time
                                </Text>
                            </div>
                            <div className="legend-item">
                                <Tag color="blue">Working Hours</Tag>
                                <Text type="secondary">
                                    Total hours worked
                                </Text>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ManagerAttendanceManagement;