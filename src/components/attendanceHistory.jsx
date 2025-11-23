import { Card, Calendar, Spin, Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const AttendanceHistory = ({
    loading,
    selectedMonth,
    attendances = [],
    onMonthChange
}) => {
    const getAttendanceForDate = (date) => {
        return attendances.find((att) => {
            const attDate = dayjs(att.checkIn);
            return attDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
        });
    };

    const dateCellRender = (date) => {
        const attendance = getAttendanceForDate(date);
        if (!attendance) return null;

        const hasCheckIn = attendance.checkIn;
        const hasCheckOut = attendance.checkOut;

        return (
            <div className="calendar-cell-content">
                {hasCheckIn && (
                    <Tag color="success" className="attendance-tag">
                        ✓ In: {dayjs(attendance.checkIn).format("HH:mm")}
                    </Tag>
                )}
                {hasCheckOut && (
                    <Tag color="blue" className="attendance-tag">
                        ✓ Out: {dayjs(attendance.checkOut).format("HH:mm")}
                    </Tag>
                )}
                {attendance.isLate !== undefined && (
                    <Tag
                        color={attendance.isLate ? "orange" : "green"}
                        className="status-tag"
                    >
                        {attendance.isLate
                            ? `LATE ${attendance.lateMinutes}m`
                            : "ON TIME"}
                    </Tag>
                )}
            </div>
        );
    };

    return (
        <Card
            className="calendar-card"
            title={
                <div className="card-title">
                    <CalendarOutlined className="title-icon" />
                    <span>Attendance History</span>
                </div>
            }
        >
            {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : (
                <Calendar
                    value={selectedMonth}
                    cellRender={dateCellRender}
                    onPanelChange={onMonthChange}
                    className="attendance-calendar"
                />
            )}
        </Card>
    );
};

export default AttendanceHistory;