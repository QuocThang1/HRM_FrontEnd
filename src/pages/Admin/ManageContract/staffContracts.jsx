import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Popconfirm,
  Alert,
  Select,
  Descriptions,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getContractByStaffIdApi,
  deleteContractApi,
} from "../../../utils/Api/contractApi";
import { detailStaffApi } from "../../../utils/Api/staffApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import CreateContractModal from "./createContractModal";
import EditContractModal from "./editContractModal";

const { Text } = Typography;
const { Option } = Select;

const StaffContracts = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    fetchStaffInfo();
    fetchContracts();
  }, [staffId]);

  useEffect(() => {
    filterContracts();
  }, [selectedStatus, contracts]);

  const fetchStaffInfo = async () => {
    try {
      const res = await detailStaffApi(staffId);
      if (res && res.data) {
        setStaffInfo(res.data);
      }
    } catch (error) {
      console.error("Error fetching staff info:", error);
      toast.error("Failed to load staff information");
    }
  };

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await getContractByStaffIdApi(staffId);
      if (res.EC === 0 && res.data) {
        const contractsArray = Array.isArray(res.data) ? res.data : [res.data];
        setContracts(contractsArray);
      } else {
        setContracts([]);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterContracts = () => {
    if (selectedStatus === "all") {
      setFilteredContracts(contracts);
    } else {
      setFilteredContracts(
        contracts.filter((contract) => contract.status === selectedStatus),
      );
    }
  };

  const handleDelete = async (contractId) => {
    try {
      const res = await deleteContractApi(contractId);
      if (res.EC === 0) {
        toast.success("Contract deleted successfully");
        fetchContracts();
      } else {
        toast.error(res.EM || "Failed to delete contract");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast.error("Failed to delete contract");
    }
  };

  const handleEdit = (contract) => {
    // Kiểm tra status trước khi cho phép edit
    if (contract.status === "expired") {
      toast.warning("Cannot edit expired contract");
      return;
    }
    setSelectedContract(contract);
    setEditModalVisible(true);
  };

  const handleView = (contractId) => {
    navigate(`/profile/contract-management/detail/${contractId}`);
  };

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "error";
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "From Date",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 120,
      align: "center",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "To Date",
      dataIndex: "toDate",
      key: "toDate",
      width: 120,
      align: "center",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Duration",
      key: "duration",
      width: 100,
      align: "center",
      render: (record) => {
        const months = dayjs(record.toDate).diff(
          dayjs(record.fromDate),
          "month",
        );
        return `${months} months`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      align: "center",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      align: "center",
      render: (_, record) => {
        const isExpired = record.status === "expired";

        return (
          <Space size="small">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleView(record._id);
              }}
            >
              View
            </Button>

            <Tooltip
              title={
                isExpired ? "Cannot edit expired contract" : "Edit contract"
              }
            >
              <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                disabled={isExpired}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record);
                }}
              />
            </Tooltip>

            <Popconfirm
              title="Delete Contract"
              description="Are you sure you want to delete this contract?"
              onConfirm={(e) => {
                e.stopPropagation();
                handleDelete(record._id);
              }}
              okText="Yes"
              cancelText="No"
              onCancel={(e) => e.stopPropagation()}
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="staff-contracts-page">
      <div className="page-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Back to Staff List
        </Button>
      </div>

      {staffInfo && (
        <Card style={{ marginBottom: 24 }} className="staff-info-card">
          <Descriptions
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <UserOutlined style={{ color: "#1890ff" }} />
                <span>Staff Information</span>
              </div>
            }
            column={2}
          >
            <Descriptions.Item label="Full Name">
              <Text strong>{staffInfo.personalInfo?.fullName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {staffInfo.personalInfo?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              <Tag color="blue">
                {staffInfo.departmentId?.departmentName || "No Department"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={staffInfo.role === "manager" ? "gold" : "green"}>
                {staffInfo.role?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card style={{ marginBottom: 24 }}>
        <Space size="large" wrap style={{ width: "100%" }}>
          <Space direction="vertical" size={4}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              Filter by Status
            </span>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 200 }}
              placeholder="Select status"
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="expired">Expired</Option>
            </Select>
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            size="large"
          >
            Create New Contract
          </Button>
        </Space>

        {selectedStatus !== "all" && (
          <Alert
            message={`Showing contracts with status: ${selectedStatus.toUpperCase()}`}
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredContracts}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 1000 }}
          onRow={(record) => ({
            onClick: () => handleView(record._id),
            style: { cursor: "pointer" },
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} contracts`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{
            emptyText: (
              <Alert
                message="No Contracts"
                description="No contracts found for this staff member"
                type="info"
                showIcon
                icon={<FileTextOutlined />}
              />
            ),
          }}
        />
      </Card>

      <CreateContractModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          fetchContracts();
        }}
        staffId={staffId}
      />

      <EditContractModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedContract(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setSelectedContract(null);
          fetchContracts();
        }}
        contract={selectedContract}
      />
    </div>
  );
};

export default StaffContracts;
