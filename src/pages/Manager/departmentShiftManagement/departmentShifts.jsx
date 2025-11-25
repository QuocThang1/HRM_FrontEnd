import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Spin,
  Empty,
  Tag,
  Button,
  Row,
  Col,
  Switch,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartmentByIdApi } from "../../../utils/Api/departmentApi";
import {
  getDepartmentShiftsApi,
  addShiftToDepartmentApi,
  deleteDepartmentShiftApi,
  updateDepartmentShiftStatusApi,
} from "../../../utils/Api/departmentShiftApi";
import { toast } from "react-toastify";
import { Modal } from "antd";
import AddShiftModal from "./addShiftModal";
import "../../../styles/departmentShifts.css";

const { Title, Text } = Typography;
const { confirm } = Modal;

const DepartmentShiftsPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    if (departmentId) {
      fetchDepartmentInfo();
      fetchDepartmentShifts();
    }
  }, [departmentId]);

  const fetchDepartmentInfo = async () => {
    try {
      const res = await getDepartmentByIdApi(departmentId);
      if (res.data) {
        setDepartment(res.data);
      }
    } catch (error) {
      console.error("Error fetching department:", error);
      toast.error("Failed to load department info", { autoClose: 2000 });
    }
  };

  const fetchDepartmentShifts = async () => {
    try {
      setLoading(true);
      const res = await getDepartmentShiftsApi(departmentId);
      if (res && Array.isArray(res.data)) {
        setShifts(res.data);
      } else {
        setShifts([]);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to load shifts", { autoClose: 2000 });
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = async (shiftTypeId) => {
    try {
      const res = await addShiftToDepartmentApi(departmentId, shiftTypeId);
      toast.success(res.EM || "Shift added successfully", {
        autoClose: 2000,
      });
      await fetchDepartmentShifts();
      // Không đóng modal, để người dùng có thể thêm nhiều ca
    } catch (error) {
      console.error("Error adding shift:", error);
      toast.error(error.response?.data?.EM || "Failed to add shift", {
        autoClose: 2000,
      });
      throw error;
    }
  };

  const handleDeleteShift = (shiftId, shiftName) => {
    confirm({
      title: "Delete Shift",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to remove "${shiftName}" from this department?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await deleteDepartmentShiftApi(shiftId);
          toast.success(res.EM || "Shift removed successfully", {
            autoClose: 2000,
          });
          fetchDepartmentShifts();
        } catch (error) {
          console.error("Error deleting shift:", error);
          toast.error("Failed to remove shift", { autoClose: 2000 });
        }
      },
    });
  };

  const handleToggleStatus = async (shiftId, currentStatus) => {
    try {
      const res = await updateDepartmentShiftStatusApi(shiftId, !currentStatus);
      toast.success(res.EM || "Status updated successfully", {
        autoClose: 2000,
      });
      fetchDepartmentShifts();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status", { autoClose: 2000 });
    }
  };

  return (
    <div className="department-shifts-page">
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

          {department && (
            <div className="dept-header-info">
              <Title level={2} className="page-title">
                {department.departmentName} - Shift Management
              </Title>
              <Text className="page-subtitle">
                Manage working shifts for this department
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="content-wrapper">
        <Card
          title={
            <div className="card-title">
              <ClockCircleOutlined className="title-icon" />
              <span>Current Shifts</span>
              <Tag color="blue">{shifts.length}</Tag>
            </div>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
            >
              Add Shift
            </Button>
          }
          className="shifts-card"
        >
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : shifts.length === 0 ? (
            <Empty description="No shifts assigned to this department">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddModalVisible(true)}
              >
                Add First Shift
              </Button>
            </Empty>
          ) : (
            <Row gutter={[24, 24]}>
              {shifts.map((shift) => (
                <Col xs={24} sm={12} lg={8} key={shift._id}>
                  <Card className="shift-item-card">
                    <div className="shift-header">
                      <div className="shift-title-section">
                        <Title level={4} className="shift-name">
                          {shift.shiftType?.shiftCode || "N/A"}
                        </Title>
                        {shift.shiftType?.isOvertime === "overtime" && (
                          <Tag color="orange">Overtime</Tag>
                        )}
                      </div>
                      <Switch
                        checked={shift.isActive}
                        onChange={() =>
                          handleToggleStatus(shift._id, shift.isActive)
                        }
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                      />
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    <div className="shift-info">
                      <div className="info-row">
                        <Text type="secondary">Time:</Text>
                        <Text strong>
                          {shift.shiftType?.fromTime || "N/A"} -{" "}
                          {shift.shiftType?.toTime || "N/A"}
                        </Text>
                      </div>

                      <div className="info-row">
                        <Text type="secondary">Late Allowed:</Text>
                        <Text>
                          {shift.shiftType?.allowedLateMinute || 0} min
                        </Text>
                      </div>
                      <div className="info-row">
                        <Text type="secondary">Early Leave:</Text>
                        <Text>
                          {shift.shiftType?.allowedEarlyLeaveMinute || 0} min
                        </Text>
                      </div>

                      {shift.shiftType?.description && (
                        <div className="shift-description">
                          <Text type="secondary">
                            {shift.shiftType.description}
                          </Text>
                        </div>
                      )}
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        handleDeleteShift(shift._id, shift.shiftType?.shiftCode)
                      }
                      className="delete-btn"
                    >
                      Remove
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      </div>

      {/* Add Shift Modal */}
      <AddShiftModal
        open={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        departmentId={departmentId}
        onSuccess={handleAddShift}
      />
    </div>
  );
};

export default DepartmentShiftsPage;
