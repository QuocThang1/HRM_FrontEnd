import { useState } from "react";
import {
  Modal,
  List,
  Button,
  Tag,
  Empty,
  Popconfirm,
  Typography,
  Space,
  Dropdown,
} from "antd";
import {
  UnorderedListOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  deleteShiftAssignmentApi,
  updateShiftAssignmentApi,
} from "../../../utils/Api/shiftAssignmentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import EditShiftModal from "./editShiftModal";
import "../../../styles/viewShiftsModal.css";

const { Text } = Typography;

const ViewShiftsModal = ({ open, onClose, staff, assignments, onUpdate }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [updating, setUpdating] = useState(null);

  const handleDelete = async (assignmentId) => {
    try {
      setUpdating(assignmentId);
      const res = await deleteShiftAssignmentApi(assignmentId);
      if (res.EC === 0) {
        toast.success(res.EM || "Shift deleted successfully", {
          autoClose: 2000,
        });
        onUpdate();
      } else {
        toast.error(res.EM || "Failed to delete shift", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting shift:", error);
      toast.error(error.response?.data?.EM || "Failed to delete shift", {
        autoClose: 2000,
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateStatus = async (assignmentId, newStatus, statusLabel) => {
    try {
      setUpdating(assignmentId);
      const res = await updateShiftAssignmentApi(assignmentId, {
        status: newStatus,
      });
      if (res.EC === 0) {
        toast.success(res.EM || `Shift ${statusLabel} successfully`, {
          autoClose: 2000,
        });
        onUpdate();
      } else {
        toast.error(res.EM || `Failed to ${statusLabel.toLowerCase()} shift`, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(`Error ${statusLabel.toLowerCase()} shift:`, error);
      toast.error(
        error.response?.data?.EM ||
          `Failed to ${statusLabel.toLowerCase()} shift`,
        { autoClose: 2000 },
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    setEditModalVisible(false);
    setSelectedAssignment(null);
    onUpdate();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "warning";
      case "cancelled":
        return "error";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusMenuItems = (assignment) => {
    const items = [];
    const { status } = assignment;

    // Completed không thể chuyển sang trạng thái khác
    if (status === "completed") {
      return [];
    }

    // Scheduled có thể chuyển sang Cancelled hoặc Completed
    if (status === "scheduled") {
      items.push({
        key: "complete",
        label: "Mark as Completed",
        icon: <CheckCircleOutlined />,
        onClick: () =>
          handleUpdateStatus(assignment._id, "completed", "completed"),
      });
      items.push({
        key: "cancel",
        label: "Cancel Shift",
        icon: <CloseCircleOutlined />,
        danger: true,
        onClick: () =>
          handleUpdateStatus(assignment._id, "cancelled", "cancelled"),
      });
    }

    // Cancelled có thể chuyển về Scheduled
    if (status === "cancelled") {
      items.push({
        key: "reschedule",
        label: "Reschedule",
        icon: <ReloadOutlined />,
        onClick: () =>
          handleUpdateStatus(assignment._id, "scheduled", "rescheduled"),
      });
    }

    return items;
  };

  // Sort assignments by fromDate (newest first)
  const sortedAssignments = [...assignments].sort((a, b) => {
    return dayjs(b.fromDate).diff(dayjs(a.fromDate));
  });

  return (
    <>
      <Modal
        title={
          <div className="modal-title">
            <UnorderedListOutlined className="modal-icon" />
            <span>Shift Assignments - {staff?.personalInfo?.fullName}</span>
          </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
        className="view-shifts-modal"
      >
        {assignments.length === 0 ? (
          <Empty
            description="No shift assignments found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button onClick={onClose}>Close</Button>
          </Empty>
        ) : (
          <List
            dataSource={sortedAssignments}
            renderItem={(assignment) => {
              const statusMenuItems = getStatusMenuItems(assignment);
              const isCompleted = assignment.status === "completed";
              const isScheduled = assignment.status === "scheduled";

              return (
                <List.Item
                  key={assignment._id}
                  className={`shift-assignment-item ${assignment.status}`}
                  actions={[
                    // Edit button - chỉ hiện khi scheduled
                    isScheduled && (
                      <Button
                        key="edit"
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(assignment)}
                      >
                        Edit
                      </Button>
                    ),
                    // Status menu - không hiện khi completed
                    !isCompleted && statusMenuItems.length > 0 && (
                      <Dropdown
                        key="status"
                        menu={{ items: statusMenuItems }}
                        trigger={["click"]}
                        disabled={updating === assignment._id}
                      >
                        <Button
                          type="link"
                          icon={<MoreOutlined />}
                          loading={updating === assignment._id}
                        >
                          Status
                        </Button>
                      </Dropdown>
                    ),
                    // Delete button - chỉ hiện khi không phải completed
                    !isCompleted && (
                      <Popconfirm
                        key="delete"
                        title="Delete this shift?"
                        description="This action cannot be undone!"
                        icon={
                          <ExclamationCircleOutlined style={{ color: "red" }} />
                        }
                        onConfirm={() => handleDelete(assignment._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                          loading: updating === assignment._id,
                        }}
                      >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                          Delete
                        </Button>
                      </Popconfirm>
                    ),
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        className={`shift-icon-wrapper ${assignment.status}`}
                      >
                        {assignment.status === "completed" ? (
                          <CheckCircleOutlined className="shift-icon" />
                        ) : assignment.status === "cancelled" ? (
                          <CloseCircleOutlined className="shift-icon" />
                        ) : (
                          <ClockCircleOutlined className="shift-icon" />
                        )}
                      </div>
                    }
                    title={
                      <div className="shift-title">
                        <Space>
                          <span className="shift-code">
                            {assignment.shiftType?.shiftCode || "N/A"}
                          </span>
                          <Tag color={getStatusColor(assignment.status)}>
                            {assignment.status?.toUpperCase()}
                          </Tag>
                          {assignment.shiftType?.isOvertime === "overtime" && (
                            <Tag color="orange">Overtime</Tag>
                          )}
                          {isCompleted && (
                            <Tag color="blue" icon={<CheckCircleOutlined />}>
                              Final
                            </Tag>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <div className="shift-details">
                        <div className="detail-row">
                          <CalendarOutlined className="detail-icon" />
                          <Text>
                            <strong>Period:</strong>{" "}
                            {dayjs(assignment.fromDate).format("DD/MM/YYYY")} -{" "}
                            {dayjs(assignment.toDate).format("DD/MM/YYYY")}
                          </Text>
                        </div>
                        <div className="detail-row">
                          <ClockCircleOutlined className="detail-icon" />
                          <Text>
                            <strong>Time:</strong>{" "}
                            {assignment.shiftType?.fromTime || "N/A"} -{" "}
                            {assignment.shiftType?.toTime || "N/A"}
                          </Text>
                        </div>
                        {assignment.shiftType?.description && (
                          <div className="detail-row description">
                            <Text type="secondary">
                              {assignment.shiftType.description}
                            </Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Modal>

      {/* Edit Shift Modal */}
      <EditShiftModal
        open={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        staff={staff}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default ViewShiftsModal;
