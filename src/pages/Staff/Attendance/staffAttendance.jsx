import { useState, useEffect } from "react";
import {
    Card,
    Button,
    Typography,
    Spin,
    Tag,
    Calendar,
} from "antd";
import {
    ClockCircleOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    LoginOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
    checkInApi,
    checkOutApi,
    getTodayAttendanceApi,
    getMyAttendancesApi,
} from "../../../utils/Api/attendanceAPI";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import CheckInModal from "./checkInModal";
import CheckOutModal from "./checkOutModal";
import "../../../styles/staffAttendance.css";

const { Title, Text } = Typography;

const StaffAttendancePage = () => {
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const [checkInModalVisible, setCheckInModalVisible] = useState(false);
    const [checkOutModalVisible, setCheckOutModalVisible] = useState(false);
    const [location, setLocation] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    useEffect(() => {
        fetchTodayAttendance();
        fetchMyAttendances();
    }, []);

    const fetchTodayAttendance = async () => {
        try {
            const res = await getTodayAttendanceApi();
            console.log("Today Attendance Response:", res);
            if (res && res.data) {
                setTodayAttendance(res.data);
            } else {
                setTodayAttendance(null);
            }
        } catch (error) {
            console.error("Error fetching today attendance:", error);
            setTodayAttendance(null);
        }
    };

    const fetchMyAttendances = async () => {
        try {
            setLoading(true);
            const startDate = selectedMonth.startOf("month").format("YYYY-MM-DD");
            const endDate = selectedMonth.endOf("month").format("YYYY-MM-DD");

            const res = await getMyAttendancesApi(startDate, endDate);
            console.log("My Attendances Response:", res);

            if (res && Array.isArray(res.data)) {
                setAttendances(res.data);
            } else {
                setAttendances([]);
            }
        } catch (error) {
            console.error("Error fetching attendances:", error);
            toast.error("Failed to load attendance history", {
                autoClose: 2000,
            });
            setAttendances([]);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`${latitude}, ${longitude}`);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    toast.warning(
                        "Unable to get your location. Please enter manually.",
                        {
                            autoClose: 3000,
                        }
                    );
                }
            );
        }
    };

    const handleCheckInClick = () => {
        getCurrentLocation();
        setCheckInModalVisible(true);
    };

    const handleCheckOutClick = () => {
        getCurrentLocation();
        setCheckOutModalVisible(true);
    };

    const handleCheckIn = async () => {
        if (!location.trim()) {
            toast.error("Please enter your location", { autoClose: 2000 });
            return;
        }

        try {
            setCheckingIn(true);
            const res = await checkInApi(location);
            console.log("Check-in Response:", res);

            if (res.EC === 0) {
                toast.success(res.EM || "Check-in successful", {
                    autoClose: 2000,
                });
                setCheckInModalVisible(false);
                setLocation("");
                await fetchTodayAttendance();
                await fetchMyAttendances();
            } else {
                toast.error(res.EM || "Check-in failed", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error checking in:", error);
            toast.error(error.response?.data?.EM || "Failed to check in", {
                autoClose: 2000,
            });
        } finally {
            setCheckingIn(false);
        }
    };

    const handleCheckOut = async () => {
        if (!location.trim()) {
            toast.error("Please enter your location", { autoClose: 2000 });
            return;
        }

        try {
            setCheckingOut(true);
            const res = await checkOutApi(location);
            console.log("Check-out Response:", res);

            if (res.EC === 0) {
                toast.success(res.EM || "Check-out successful", {
                    autoClose: 2000,
                });
                setCheckOutModalVisible(false);
                setLocation("");
                await fetchTodayAttendance();
                await fetchMyAttendances();
            } else {
                toast.error(res.EM || "Check-out failed", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error checking out:", error);
            toast.error(error.response?.data?.EM || "Failed to check out", {
                autoClose: 2000,
            });
        } finally {
            setCheckingOut(false);
        }
    };

    const handleCheckInModalCancel = () => {
        setCheckInModalVisible(false);
        setLocation("");
    };

    const handleCheckOutModalCancel = () => {
        setCheckOutModalVisible(false);
        setLocation("");
    };

    const getAttendanceForDate = (date) => {
        return attendances.find((att) => {
            const attDate = dayjs(att.date);
            return attDate.isSame(date, "day");
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

    const handleMonthChange = (date) => {
        setSelectedMonth(date);
    };

    useEffect(() => {
        fetchMyAttendances();
    }, [selectedMonth]);

    // Kiểm tra đã check-in và chưa check-out
    const canCheckOut =
        todayAttendance && todayAttendance.checkIn && !todayAttendance.checkOut;

    return (
        <div className="staff-attendance-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title-section">
                        <ClockCircleOutlined className="header-icon" />
                        <div>
                            <Title level={2} className="page-title">
                                My Attendance
                            </Title>
                            <Text className="page-subtitle">
                                Track your daily check-in and check-out
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="content-wrapper">
                {/* Today's Attendance Card */}
                <Card className="today-attendance-card">
                    <div className="today-header">
                        <div className="today-info">
                            <CalendarOutlined className="today-icon" />
                            <div>
                                <Title level={3} className="today-title">
                                    Todays Attendance
                                </Title>
                                <Text className="today-date">
                                    {dayjs().format("dddd, DD MMMM YYYY")}
                                </Text>
                            </div>
                        </div>
                    </div>

                    {todayAttendance ? (
                        <div className="attendance-details">
                            <div className="attendance-status">
                                <CheckCircleOutlined className="status-icon checked-in" />
                                <div className="status-info">
                                    <Text className="status-label">Status</Text>
                                    <Tag
                                        color={
                                            todayAttendance.checkOut
                                                ? "blue"
                                                : "success"
                                        }
                                        className="status-value"
                                    >
                                        {todayAttendance.checkOut
                                            ? "Checked Out"
                                            : "Checked In"}
                                    </Tag>
                                </div>
                            </div>

                            <div className="time-info-grid">
                                <div className="time-info-item">
                                    <ClockCircleOutlined className="time-icon" />
                                    <div>
                                        <Text className="time-label">
                                            Check-in Time
                                        </Text>
                                        <Text className="time-value">
                                            {todayAttendance.checkIn
                                                ? dayjs(
                                                    todayAttendance.checkIn
                                                ).format("HH:mm:ss")
                                                : "N/A"}
                                        </Text>
                                    </div>
                                </div>

                                <div className="time-info-item">
                                    <EnvironmentOutlined className="time-icon" />
                                    <div>
                                        <Text className="time-label">
                                            Check-in Location
                                        </Text>
                                        <Text className="time-value" ellipsis>
                                            {todayAttendance.location || "N/A"}
                                        </Text>
                                    </div>
                                </div>

                                {todayAttendance.checkOut && (
                                    <>
                                        <div className="time-info-item">
                                            <ClockCircleOutlined className="time-icon" />
                                            <div>
                                                <Text className="time-label">
                                                    Check-out Time
                                                </Text>
                                                <Text className="time-value">
                                                    {dayjs(
                                                        todayAttendance.checkOut
                                                    ).format("HH:mm:ss")}
                                                </Text>
                                            </div>
                                        </div>

                                        <div className="time-info-item">
                                            <ClockCircleOutlined className="time-icon" />
                                            <div>
                                                <Text className="time-label">
                                                    Working Hours
                                                </Text>
                                                <Text className="time-value">
                                                    {todayAttendance.workingHours ||
                                                        0}{" "}
                                                    hours
                                                </Text>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {todayAttendance.isLate !== undefined && (
                                    <div className="time-info-item">
                                        <ExclamationCircleOutlined className="time-icon" />
                                        <div>
                                            <Text className="time-label">
                                                Late Status
                                            </Text>
                                            <Tag
                                                color={
                                                    todayAttendance.isLate
                                                        ? "orange"
                                                        : "green"
                                                }
                                            >
                                                {todayAttendance.isLate
                                                    ? `LATE (${todayAttendance.lateMinutes ||
                                                    0
                                                    } min)`
                                                    : "ON TIME"}
                                            </Tag>
                                        </div>
                                    </div>
                                )}

                                {todayAttendance.isEarlyLeave !== undefined &&
                                    todayAttendance.checkOut && (
                                        <div className="time-info-item">
                                            <ExclamationCircleOutlined className="time-icon" />
                                            <div>
                                                <Text className="time-label">
                                                    Early Leave
                                                </Text>
                                                <Tag
                                                    color={
                                                        todayAttendance.isEarlyLeave
                                                            ? "orange"
                                                            : "green"
                                                    }
                                                >
                                                    {todayAttendance.isEarlyLeave
                                                        ? `YES (${todayAttendance.earlyLeaveMinutes ||
                                                        0
                                                        } min)`
                                                        : "NO"}
                                                </Tag>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Check-out Button */}
                            {canCheckOut && (
                                <div className="checkout-action">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<LogoutOutlined />}
                                        onClick={handleCheckOutClick}
                                        className="check-out-btn"
                                        danger
                                    >
                                        Check Out
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-attendance">
                            <ExclamationCircleOutlined className="no-attendance-icon" />
                            <Text className="no-attendance-text">
                                You have not checked in today
                            </Text>
                            <Button
                                type="primary"
                                size="large"
                                icon={<LoginOutlined />}
                                onClick={handleCheckInClick}
                                className="check-in-btn"
                            >
                                Check In Now
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Attendance Calendar */}
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
                            cellRender={dateCellRender}
                            onPanelChange={handleMonthChange}
                            className="attendance-calendar"
                        />
                    )}
                </Card>
            </div>

            {/* Check-in Modal */}
            <CheckInModal
                open={checkInModalVisible}
                onCancel={handleCheckInModalCancel}
                onConfirm={handleCheckIn}
                loading={checkingIn}
                location={location}
                setLocation={setLocation}
            />

            {/* Check-out Modal */}
            <CheckOutModal
                open={checkOutModalVisible}
                onCancel={handleCheckOutModalCancel}
                onConfirm={handleCheckOut}
                loading={checkingOut}
                location={location}
                setLocation={setLocation}
                todayAttendance={todayAttendance}
            />
        </div>
    );
};

export default StaffAttendancePage;