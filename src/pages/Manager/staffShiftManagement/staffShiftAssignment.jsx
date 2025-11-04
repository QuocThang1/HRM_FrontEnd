import { useState, useEffect } from "react";
import {
    Card,
    Button,
    Calendar,
    Badge,
    Typography,
    Spin,
    Tag,
} from "antd";
import {
    ArrowLeftOutlined,
    PlusOutlined,
    ClockCircleOutlined,
    UserOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { detailStaffApi } from "../../../utils/Api/staffApi";
import { getAllShiftAssignmentsApi } from "../../../utils/Api/shiftAssignmentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import AssignShiftModal from "./assignShiftModal";
import ViewShiftsModal from "./viewShiftsModal";
import "../../../styles/staffShiftAssignment.css";

dayjs.extend(isBetween);

const { Title, Text } = Typography;

const StaffShiftAssignmentPage = () => {
    const { staffId } = useParams();
    const navigate = useNavigate();
    const [staff, setStaff] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [viewShiftsModalVisible, setViewShiftsModalVisible] = useState(false);
    const [setSelectedMonth] = useState(dayjs());

    useEffect(() => {
        if (staffId) {
            fetchStaffInfo();
            fetchShiftAssignments();
        }
    }, [staffId]);

    const fetchStaffInfo = async () => {
        try {
            const res = await detailStaffApi(staffId);
            if (res.data) {
                setStaff(res.data);
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("Failed to load staff info", { autoClose: 2000 });
        }
    };

    const fetchShiftAssignments = async () => {
        try {
            setLoading(true);
            const res = await getAllShiftAssignmentsApi(null, staffId);
            if (res && Array.isArray(res.data)) {
                setAssignments(res.data);
            } else {
                setAssignments([]);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            toast.error("Failed to load shift assignments", {
                autoClose: 2000,
            });
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    };

    const getAssignmentsForDate = (date) => {
        return assignments.filter((assignment) => {
            const checkDate = dayjs(date);
            const fromDate = dayjs(assignment.fromDate);
            const toDate = dayjs(assignment.toDate);
            return checkDate.isBetween(fromDate, toDate, "day", "[]");
        });
    };

    const dateCellRender = (date) => {
        const dayAssignments = getAssignmentsForDate(date);

        if (dayAssignments.length === 0) return null;

        return (
            <div className="calendar-cell-content">
                {dayAssignments.map((assignment) => (
                    <Badge
                        key={assignment._id}
                        status={
                            assignment.status === "scheduled"
                                ? "warning"
                                : assignment.status === "cancelled"
                                    ? "error"
                                    : assignment.status === "completed"
                                        ? "success"
                                        : "default"
                        }
                        text={
                            <span className="shift-badge-text">
                                {assignment.shiftType?.shiftCode || "N/A"}
                            </span>
                        }
                        className={`shift-badge ${assignment.status}`}
                    />
                ))}
            </div>
        );
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    const handleAssignSuccess = () => {
        fetchShiftAssignments();
        setAssignModalVisible(false);
    };

    const handleUpdateSuccess = () => {
        fetchShiftAssignments();
    };

    if (!staff) {
        return (
            <div className="staff-shift-assignment-page">
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className="staff-shift-assignment-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        className="back-button"
                        onClick={() => navigate("/profile/department-shift-management")}
                    >
                        Back to Department
                    </Button>

                    <div className="staff-header-info">
                        <div className="staff-title-section">
                            <UserOutlined className="staff-icon" />
                            <div>
                                <Title level={2} className="page-title">
                                    {staff.personalInfo?.fullName || "N/A"}
                                </Title>
                                <Text className="page-subtitle">
                                    Shift Assignment Schedule
                                </Text>
                            </div>
                        </div>
                        <div className="staff-meta">
                            <Tag color="blue">
                                {staff.personalInfo?.email || "N/A"}
                            </Tag>
                            <Tag
                                color={
                                    staff.role === "manager"
                                        ? "orange"
                                        : "green"
                                }
                            >
                                {staff.role?.toUpperCase()}
                            </Tag>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="content-wrapper">
                {/* Action Bar */}
                <Card className="action-bar">
                    <div className="action-bar-content">
                        <div className="legend">
                            <div className="legend-item">
                                <Badge status="warning" />
                                <Text>Scheduled</Text>
                            </div>
                            <div className="legend-item">
                                <Badge status="error" />
                                <Text>Cancelled</Text>
                            </div>
                            <div className="legend-item">
                                <Badge status="success" />
                                <Text>Completed</Text>
                            </div>
                        </div>
                        <div className="action-buttons">
                            <Button
                                icon={<UnorderedListOutlined />}
                                onClick={() => setViewShiftsModalVisible(true)}
                                size="large"
                            >
                                View Shifts
                            </Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setAssignModalVisible(true)}
                                size="large"
                            >
                                Assign Shift
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Calendar */}
                <Card
                    className="calendar-card"
                    title={
                        <div className="card-title">
                            <ClockCircleOutlined className="title-icon" />
                            <span>Shift Schedule</span>
                        </div>
                    }
                >
                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Calendar
                            cellRender={dateCellRender}
                            onPanelChange={handleMonthChange}
                            className="shift-calendar"
                        />
                    )}
                </Card>
            </div>

            {/* Assign Shift Modal */}
            <AssignShiftModal
                open={assignModalVisible}
                onClose={() => setAssignModalVisible(false)}
                staffId={staffId}
                staff={staff}
                onSuccess={handleAssignSuccess}
            />

            <ViewShiftsModal
                open={viewShiftsModalVisible}
                onClose={() => setViewShiftsModalVisible(false)}
                staffId={staffId}
                staff={staff}
                assignments={assignments}
                onUpdate={handleUpdateSuccess}
            />
        </div>
    );
};

export default StaffShiftAssignmentPage;