import { useState, useEffect } from "react";
import {
    Card,
    Calendar,
    Badge,
    Typography,
    Spin,
    Empty,
} from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import { getShiftAssignmentByStaffIdApi } from "../../../utils/Api/shiftAssignmentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import ShiftDetailsModal from "./shiftDetailsModal";
import "../../../styles/staffShiftSchedule.css";

dayjs.extend(isBetween);

const { Title, Text } = Typography;

const StaffShiftSchedulePage = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setSelectedMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);

    useEffect(() => {
        fetchMyShiftAssignments();
    }, []);

    const fetchMyShiftAssignments = async () => {
        try {
            setLoading(true);
            const res = await getShiftAssignmentByStaffIdApi();
            if (res && Array.isArray(res.data)) {
                // Chỉ hiển thị scheduled và completed
                const activeAssignments = res.data.filter(
                    (a) => a.status === "scheduled" || a.status === "completed"
                );
                setAssignments(activeAssignments);
            } else {
                setAssignments([]);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            toast.error("Failed to load your shift schedule", {
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

    const handleDateSelect = (date) => {
        const dayAssignments = getAssignmentsForDate(date);
        if (dayAssignments.length > 0) {
            setSelectedDate(date);
            setDetailsModalVisible(true);
        }
    };

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    // Thống kê ca làm việc
    const scheduledCount = assignments.filter(
        (a) => a.status === "scheduled"
    ).length;
    const completedCount = assignments.filter(
        (a) => a.status === "completed"
    ).length;

    // Lấy ca làm gần nhất
    const upcomingShifts = assignments
        .filter((a) => {
            const fromDate = dayjs(a.fromDate);
            return (
                a.status === "scheduled" &&
                fromDate.isAfter(dayjs().subtract(1, "day"))
            );
        })
        .sort((a, b) => dayjs(a.fromDate).diff(dayjs(b.fromDate)))
        .slice(0, 3);

    return (
        <div className="staff-shift-schedule-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title-section">
                        <CalendarOutlined className="header-icon" />
                        <div>
                            <Title level={2} className="page-title">
                                My Shift Schedule
                            </Title>
                            <Text className="page-subtitle">
                                View your assigned work shifts
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="content-wrapper">
                {/* Stats Cards */}
                <div className="stats-container">
                    <Card className="stat-card scheduled">
                        <div className="stat-content">
                            <div className="stat-icon">
                                <ClockCircleOutlined />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{scheduledCount}</div>
                                <div className="stat-label">Scheduled Shifts</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="stat-card completed">
                        <div className="stat-content">
                            <div className="stat-icon">
                                <CalendarOutlined />
                            </div>
                            <div className="stat-info">
                                <div className="stat-value">{completedCount}</div>
                                <div className="stat-label">Completed Shifts</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Upcoming Shifts */}
                {upcomingShifts.length > 0 && (
                    <Card
                        className="upcoming-shifts-card"
                        title={
                            <div className="card-title">
                                <InfoCircleOutlined className="title-icon" />
                                <span>Upcoming Shifts</span>
                            </div>
                        }
                    >
                        <div className="upcoming-shifts-list">
                            {upcomingShifts.map((shift) => (
                                <div key={shift._id} className="upcoming-shift-item">
                                    <div className="shift-date">
                                        <div className="date-number">
                                            {dayjs(shift.fromDate).format("DD")}
                                        </div>
                                        <div className="date-month">
                                            {dayjs(shift.fromDate).format("MMM")}
                                        </div>
                                    </div>
                                    <div className="shift-details">
                                        <div className="shift-name">
                                            {shift.shiftType?.shiftCode || "N/A"}
                                        </div>
                                        <div className="shift-time">
                                            <ClockCircleOutlined className="time-icon" />
                                            {shift.shiftType?.fromTime} -{" "}
                                            {shift.shiftType?.toTime}
                                        </div>
                                        <div className="shift-period">
                                            {dayjs(shift.fromDate).format(
                                                "DD/MM/YYYY"
                                            )}{" "}
                                            - {dayjs(shift.toDate).format("DD/MM/YYYY")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Legend */}
                <Card className="legend-card">
                    <div className="legend-content">
                        <div className="legend-item">
                            <Badge status="warning" />
                            <Text>Scheduled</Text>
                        </div>
                        <div className="legend-item">
                            <Badge status="success" />
                            <Text>Completed</Text>
                        </div>
                        <div className="legend-note">
                            <InfoCircleOutlined className="note-icon" />
                            <Text type="secondary">
                                Click on a date to view shift details
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Calendar */}
                <Card
                    className="calendar-card"
                    title={
                        <div className="card-title">
                            <CalendarOutlined className="title-icon" />
                            <span>Monthly Schedule</span>
                        </div>
                    }
                >
                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                        </div>
                    ) : assignments.length === 0 ? (
                        <Empty
                            description="No shift assignments found"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Text type="secondary">
                                You do not have any assigned shifts yet.
                            </Text>
                        </Empty>
                    ) : (
                        <Calendar
                            cellRender={dateCellRender}
                            onPanelChange={handleMonthChange}
                            onSelect={handleDateSelect}
                            className="shift-calendar"
                        />
                    )}
                </Card>
            </div>

            {/* Shift Details Modal */}
            <ShiftDetailsModal
                open={detailsModalVisible}
                onClose={() => {
                    setDetailsModalVisible(false);
                    setSelectedDate(null);
                }}
                date={selectedDate}
                assignments={
                    selectedDate ? getAssignmentsForDate(selectedDate) : []
                }
            />
        </div>
    );
};

export default StaffShiftSchedulePage;