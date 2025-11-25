import { Modal, Input, Typography } from "antd";
import {
  LoginOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

const CheckInModal = ({
  open,
  onCancel,
  onConfirm,
  loading,
  location,
  setLocation,
}) => {
  return (
    <Modal
      title={
        <div className="modal-title">
          <LoginOutlined className="modal-icon" />
          <span>Check In</span>
        </div>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Check In"
      cancelText="Cancel"
      confirmLoading={loading}
      width={500}
      className="check-in-modal"
    >
      <div className="check-in-form">
        <div className="form-info">
          <ClockCircleOutlined className="info-icon" />
          <div>
            <Text strong>Current Time</Text>
            <Text className="current-time">{dayjs().format("HH:mm:ss")}</Text>
          </div>
        </div>

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

export default CheckInModal;
