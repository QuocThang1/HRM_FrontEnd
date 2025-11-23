import { useState, useEffect } from "react";
import { Card, Table, Tag, Avatar, Spin, Empty, DatePicker, Space } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { getAllShiftAssignmentsApi } from "../utils/Api/shiftAssignmentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "../styles/departmentScheduleTable.css";

dayjs.extend(isBetween);

const DepartmentScheduleTable = ({ departmentId, staffList }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        if (departmentId) {
            fetchAssignments();
        }
    }, [departmentId]);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const res = await getAllShiftAssignmentsApi(departmentId, null);
            if (res && Array.isArray(res.data)) {
                // Chỉ lấy các assignment scheduled và completed
                const activeAssignments = res.data.filter(
                    (a) => a.status === "scheduled" || a.status === "completed"
                );
                setAssignments(activeAssignments);
            } else {
                setAssignments([]);
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
            toast.error("Failed to load schedule", { autoClose: 2000 });
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách 7 ngày từ ngày được chọn
    const getWeekDates = () => {
        const dates = [];
        const startOfWeek = selectedDate.startOf("week");
        for (let i = 0; i < 7; i++) {
            dates.push(startOfWeek.add(i, "day"));
        }
        return dates;
    };

    const getAssignmentsForStaffAndDate = (staffId, date) => {
        return assignments.filter((assignment) => {
            const checkDate = dayjs(date);
            const fromDate = dayjs(assignment.fromDate);
            const toDate = dayjs(assignment.toDate);

            // assignment.staff có thể là object hoặc string ID
            const assignmentStaffId = typeof assignment.staff === 'object'
                ? assignment.staff._id
                : assignment.staff;

            return (
                assignmentStaffId === staffId &&
                checkDate.isBetween(fromDate, toDate, "day", "[]")
            );
        });
    };

    const getAvatarColor = (name) => {
        const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068"];
        const index = name?.charCodeAt(0) % colors.length;
        return colors[index];
    };

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

    const weekDates = getWeekDates();

    const columns = [
        {
            title: "Staff Member",
            key: "staff",
            fixed: "left",
            width: 200,
            render: (_, staff) => (
                <div className="staff-cell">
                    <Avatar
                        size={32}
                        style={{
                            backgroundColor: getAvatarColor(
                                staff.personalInfo?.fullName
                            ),
                        }}
                    >
                        {staff.personalInfo?.fullName?.charAt(0).toUpperCase() ||
                            "?"}
                    </Avatar>
                    <div className="staff-info">
                        <div className="staff-name">
                            {staff.personalInfo?.fullName || "N/A"}
                        </div>
                        <Tag
                            size="small"
                            color={
                                staff.role === "manager" ? "orange" : "blue"
                            }
                        >
                            {staff.role?.toUpperCase()}
                        </Tag>
                    </div>
                </div>
            ),
        },
        ...weekDates.map((date) => ({
            title: (
                <div className="date-header">
                    <div className="day-name">{date.format("ddd")}</div>
                    <div className="date-number">{date.format("DD")}</div>
                    <div className="month-name">{date.format("MMM")}</div>
                </div>
            ),
            key: date.format("YYYY-MM-DD"),
            width: 150,
            render: (_, staff) => {
                const dayAssignments = getAssignmentsForStaffAndDate(
                    staff._id,
                    date
                );
                if (dayAssignments.length === 0) {
                    return <div className="empty-cell">-</div>;
                }
                return (
                    <div className="shift-cell">
                        {dayAssignments.map((assignment) => (
                            <div
                                key={assignment._id}
                                className={`shift-tag ${assignment.status}`}
                            >
                                <ClockCircleOutlined className="shift-icon" />
                                <div className="shift-info">
                                    <div className="shift-code">
                                        {assignment.shiftType?.shiftCode || "N/A"}
                                    </div>
                                    <div className="shift-time">
                                        {assignment.shiftType?.fromTime} -{" "}
                                        {assignment.shiftType?.toTime}
                                    </div>
                                </div>
                                <Tag
                                    size="small"
                                    color={getStatusColor(assignment.status)}
                                    className="status-tag"
                                >
                                    {assignment.status === "scheduled"
                                        ? "S"
                                        : "C"}
                                </Tag>
                            </div>
                        ))}
                    </div>
                );
            },
        })),
    ];

    // Chỉ hiển thị staff role "staff"
    const regularStaff = staffList.filter((s) => s.role === "staff");

    return (
        <Card
            className="department-schedule-card"
            title={
                <div className="card-title">
                    <CalendarOutlined className="title-icon" />
                    <span>Weekly Schedule</span>
                </div>
            }
            extra={
                <Space>
                    <DatePicker
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date || dayjs())}
                        format="DD/MM/YYYY"
                        allowClear={false}
                        picker="week"
                    />
                </Space>
            }
        >
            {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : regularStaff.length === 0 ? (
                <Empty description="No staff to display schedule" />
            ) : (
                <div className="schedule-table-wrapper">
                    <Table
                        columns={columns}
                        dataSource={regularStaff}
                        rowKey="_id"
                        pagination={false}
                        scroll={{ x: 1400 }}
                        className="schedule-table"
                    />
                </div>
            )}

            {/* Legend */}
            <div className="schedule-legend">
                <div className="legend-item">
                    <Tag color="warning">S</Tag>
                    <span>Scheduled</span>
                </div>
                <div className="legend-item">
                    <Tag color="success">C</Tag>
                    <span>Completed</span>
                </div>
            </div>
        </Card>
    );
};

export default DepartmentScheduleTable;