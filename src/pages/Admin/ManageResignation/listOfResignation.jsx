import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Popconfirm,
  Form,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  getResignationsByApproverApi,
  updateResignationStatusApi,
  deleteResignationApi,
} from "../../../utils/Api/resignationApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ResignationDetailModalAdmin from "./resignationDetailModal.jsx";
import EditStatusModal from "./editStatusModal.jsx";
import "../../../styles/adminResignation.css";

const { Text } = Typography;

const AdminResignationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [resignations, setResignations] = useState([]);
  const [filteredResignations, setFilteredResignations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedResignation, setSelectedResignation] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchResignations();
  }, []);

  useEffect(() => {
    filterResignations();
  }, [selectedStatus, resignations]);

  const fetchResignations = async () => {
    try {
      setLoading(true);
      const res = await getResignationsByApproverApi();
      if (res && res.EC === 0 && res.data) {
        setResignations(res.data);
      } else {
        toast.error(res?.EM || "Failed to fetch resignations");
      }
    } catch (error) {
      console.error("Error fetching resignations:", error);
      toast.error("An error occurred while fetching resignations");
    } finally {
      setLoading(false);
    }
  };

  const filterResignations = () => {
    if (selectedStatus === "all") {
      setFilteredResignations(resignations);
    } else {
      setFilteredResignations(
        resignations.filter((r) => r.status === selectedStatus),
      );
    }
  };

  const handleViewDetail = (record) => {
    setSelectedResignation(record);
    setDetailModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedResignation(record);
    form.setFieldsValue({
      status: record.status,
      adminNote: record.adminNote || "",
    });
    setEditModalVisible(true);
  };

  const handleUpdateStatus = async (values) => {
    try {
      const res = await updateResignationStatusApi(
        selectedResignation._id,
        values.status,
        values.adminNote,
      );

      if (res && res.EC === 0) {
        toast.success(res.EM || "Status updated successfully");
        setEditModalVisible(false);
        form.resetFields();
        fetchResignations();
      } else {
        toast.error(res?.EM || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
    }
  };

  const handleStatCardClick = (status) => {
    setSelectedStatus(status);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteResignationApi(id);
      if (res && res.EC === 0) {
        toast.success(res.EM || "Resignation deleted successfully");
        fetchResignations();
      } else {
        toast.error(res?.EM || "Failed to delete resignation");
      }
    } catch (error) {
      console.error("Error deleting resignation:", error);
      toast.error("An error occurred while deleting");
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: {
        color: "orange",
        icon: <ClockCircleOutlined />,
        text: "Pending",
      },
      approved: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Approved",
      },
      rejected: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text.toUpperCase()}
      </Tag>
    );
  };

  const getStatusCount = (status) => {
    return resignations.filter((r) => r.status === status).length;
  };

  const columns = [
    {
      title: "Staff",
      dataIndex: ["staffId", "personalInfo", "fullName"],
      key: "staff",
      width: 150,
      render: (name, record) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5",
          }}
        >
          <Space direction="vertical" size={0}>
            <Text strong>{name || "N/A"}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.staffId?.personalInfo?.fullName || ""}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: "Submitted Date",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) =>
        dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix(),
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => getStatusTag(status),
      width: 120,
    },
    {
      title: "Processed Date",
      dataIndex: "processedAt",
      key: "processedAt",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-"),
      width: 180,
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            View CV
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Resignation"
            description="Are you sure you want to delete this resignation?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-resignation-page">
      <div className="page-header">
        <h1 className="page-title">Resignation Management</h1>
        <p className="page-subtitle">Manage and review resignation requests</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <Card
          className={`stat-card ${selectedStatus === "all" ? "active" : ""}`}
          hoverable
          onClick={() => handleStatCardClick("all")}
        >
          <div className="stat-icon all">
            <TeamOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{resignations.length}</div>
            <div className="stat-label">Total Resignations</div>
          </div>
        </Card>

        <Card
          className={`stat-card ${selectedStatus === "pending" ? "active" : ""}`}
          hoverable
          onClick={() => handleStatCardClick("pending")}
        >
          <div className="stat-icon pending">
            <ClockCircleOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{getStatusCount("pending")}</div>
            <div className="stat-label">Pending</div>
          </div>
        </Card>

        <Card
          className={`stat-card ${selectedStatus === "approved" ? "active" : ""}`}
          hoverable
          onClick={() => handleStatCardClick("approved")}
        >
          <div className="stat-icon approved">
            <CheckCircleOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{getStatusCount("approved")}</div>
            <div className="stat-label">Approved</div>
          </div>
        </Card>

        <Card
          className={`stat-card ${selectedStatus === "rejected" ? "active" : ""}`}
          hoverable
          onClick={() => handleStatCardClick("rejected")}
        >
          <div className="stat-icon rejected">
            <CloseCircleOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{getStatusCount("rejected")}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredResignations}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} resignations`,
          }}
          locale={{
            emptyText: "No resignations found",
          }}
        />
      </Card>

      {/* Modals */}
      <ResignationDetailModalAdmin
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        resignation={selectedResignation}
      />

      <EditStatusModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        resignation={selectedResignation}
        onSubmit={handleUpdateStatus}
        form={form}
      />
    </div>
  );
};

export default AdminResignationManagement;
