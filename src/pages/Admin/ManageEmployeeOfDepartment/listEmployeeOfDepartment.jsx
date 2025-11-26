import { useEffect, useState, useContext } from "react";
import { Table, Button, Popconfirm, Card, Space, Typography, Tag } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getStaffByDepartmentApi,
  removeStaffFromDepartmentApi,
} from "../../../utils/Api/staffApi";
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  UserAddOutlined,
  FileTextOutlined,
  EyeOutlined,
  TeamOutlined,
  CrownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AddEmployeeToDepartmentModal from "./addEmployeeToDepartmentModal";
import CreateDepartmentReviewModal from "../ManageDepartmentReview/createDepartmentReviewModal";
import { AuthContext } from "../../../context/auth.context";
import { toast } from "react-toastify";
import ViewDepartmentReviewsModal from "../ManageDepartment/viewDepartmentReviewsModal";
import "../../../styles/ListEmployeeOfDepartment.css";

const { Title, Text } = Typography;

const ListEmployeeOfDepartment = () => {
  const { departmentId } = useParams();
  const [employees, setEmployees] = useState([]);
  const location = useLocation();
  const departmentName = location.state?.departmentName || "Department";
  const managerId = location.state?.managerId;
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
  const [isViewReviewsOpen, setIsViewReviewsOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line
  }, [departmentId]);

  const fetchEmployees = async () => {
    try {
      const res = await getStaffByDepartmentApi(departmentId);
      if (res && res.EC === 0 && Array.isArray(res.data)) {
        setEmployees(res.data);
      } else {
        toast.error(res?.EM || "Failed to fetch employees", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Cannot fetch employees from server", { autoClose: 2000 });
    }
  };

  const handleRemove = async (staffId) => {
    try {
      const res = await removeStaffFromDepartmentApi(staffId);
      if (res && res.EC === 0) {
        toast.success(res.EM, { autoClose: 2000 });
        fetchEmployees();
      } else {
        toast.error(res?.EM || "Failed to remove employee", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Error removing employee from department", {
        autoClose: 2000,
      });
    }
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
      title: "Full Name",
      dataIndex: ["personalInfo", "fullName"],
      width: 250,
      render: (text, record) => (
        <Space direction="vertical" size={4}>
          <Text strong style={{ fontSize: 14 }}>
            {text}
          </Text>
          {managerId && record._id === managerId && (
            <Tag className="manager-badge" icon={<CrownOutlined />}>
              MANAGER
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: ["personalInfo", "email"],
      width: 280,
      render: (text) => <Text style={{ color: "#666" }}>{text}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      width: 120,
      align: "center",
      render: (role) => <span className={`role-tag ${role}`}>{role}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Remove Employee"
          description="Are you sure you want to remove this employee from the department?"
          onConfirm={() => handleRemove(record._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="action-button"
            onClick={(e) => e.stopPropagation()}
          >
            <DeleteOutlined />
          </button>
        </Popconfirm>
      ),
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
    },
  ];

  return (
    <div className="employee-department-page">
      {/* Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="back-button"
            >
              Back to Departments
            </Button>
            <Title level={2} className="page-title">
              <TeamOutlined /> {departmentName}
            </Title>
            <Text className="page-subtitle">
              Manage department employees and reviews
            </Text>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<FileTextOutlined />}
              onClick={() => setIsCreateReviewModalOpen(true)}
            >
              Create Review
            </Button>
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setIsViewReviewsOpen(true);
              }}
            >
              View Reviews
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsAddEmployeeModalOpen(true)}
            >
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <Card
        className="employees-table-card"
        title={
          <Space>
            <UserOutlined />
            <span>Department Employees</span>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} employees`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          rowClassName={(record) =>
            managerId && record._id === managerId ? "manager-row" : ""
          }
          locale={{
            emptyText: (
              <div className="empty-state">
                <UserOutlined className="empty-icon" />
                <div className="empty-title">No Employees</div>
                <div className="empty-description">
                  This department does not have any employees yet.
                </div>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => setIsAddEmployeeModalOpen(true)}
                >
                  Add First Employee
                </Button>
              </div>
            ),
          }}
        />
      </Card>

      {/* Modals */}
      <AddEmployeeToDepartmentModal
        open={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        departmentId={departmentId}
        onSuccess={fetchEmployees}
      />
      <CreateDepartmentReviewModal
        open={isCreateReviewModalOpen}
        onClose={() => setIsCreateReviewModalOpen(false)}
        departmentId={departmentId}
        adminId={auth.staff._id}
        onSuccess={() => {
          /* Optionally reload reviews */
        }}
      />
      <ViewDepartmentReviewsModal
        open={isViewReviewsOpen}
        onClose={() => setIsViewReviewsOpen(false)}
        departmentId={departmentId}
      />
    </div>
  );
};

export default ListEmployeeOfDepartment;
