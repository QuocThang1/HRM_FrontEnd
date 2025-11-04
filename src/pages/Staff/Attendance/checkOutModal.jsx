import { Modal, Input, Typography } from "antd";
import {
    LogoutOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

const CheckOutModal = ({
    open,
    onCancel,
    onConfirm,
    loading,
    location,
    setLocation,
    todayAttendance,
}) => {
    return (
        <Modal
            title={
                <div className="modal-title">
                    <LogoutOutlined className="modal-icon" />
                    <span>Check Out</span>
                </div>
            }
            open={open}
            onOk={onConfirm}
            onCancel={onCancel}
            okText="Check Out"
            cancelText="Cancel"
            confirmLoading={loading}
            width={500}
            className="check-out-modal"
            okButtonProps={{ danger: true }}
        >
            <div className="check-in-form">
                <div className="form-info">
                    <ClockCircleOutlined className="info-icon" />
                    <div>
                        <Text strong>Current Time</Text>
                        <Text className="current-time">
                            {dayjs().format("HH:mm:ss")}
                        </Text>
                    </div>
                </div>

                {todayAttendance && (
                    <div className="checkout-summary">
                        <Text strong>Todays Summary:</Text>
                        <div className="summary-item">
                            <Text type="secondary">Check-in:</Text>
                            <Text strong>
                                {dayjs(todayAttendance.checkIn).format("HH:mm:ss")}
                            </Text>
                        </div>
                        <div className="summary-item">
                            <Text type="secondary">Duration:</Text>
                            <Text strong>
                                {dayjs()
                                    .diff(
                                        dayjs(todayAttendance.checkIn),
                                        "hour",
                                        true
                                    )
                                    .toFixed(2)}{" "}
                                hours
                            </Text>
                        </div>
                    </div>
                )}

                <div className="form-item">
                    <Text strong className="form-label">
                        <EnvironmentOutlined /> Location
                    </Text>
                    <TextArea
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter your location or coordinates will be auto-filled"
                        rows={3}
                        className="location-input"
                    />
                    <Text type="secondary" className="form-hint">
                        Your location helps us verify your attendance
                    </Text>
                </div>
            </div>
        </Modal>
    );
};

export default CheckOutModal;