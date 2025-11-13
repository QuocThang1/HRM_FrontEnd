import { Table, Button, Popconfirm, Card, Space, Tag, Avatar } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDepartmentsApi,
  deleteDepartmentApi,
} from "../../../utils/Api/departmentApi";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ApartmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AddDepartmentModal from "./addDepartmentModal";
import EditDepartmentModal from "./editDepartmentModal";
import { toast } from "react-toastify";
import "../../../styles/listOfDepartment.css";

const DepartmentPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentDepartmentId, setCurrentDepartmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await getDepartmentsApi();
      if (res && Array.isArray(res.data)) {
        setDataSource(res.data);
      } else {
        toast.error(res?.EM || "Failed to fetch departments", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Cannot fetch departments from server", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setCurrentDepartmentId(record._id);
    setEditModalOpen(true);
  };

  const handleDelete = async (departmentId) => {
    try {
      setLoading(true);
      await deleteDepartmentApi(departmentId);
      toast.success("Department deleted successfully", { autoClose: 2000 });
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: 130,
      ellipsis: true,
      render: (id) => (
        <span className="department-id">{id.substring(0, 8)}...</span>
      ),
    },
    {
      title: "Department Name",
      dataIndex: "departmentName",
      key: "departmentName",
      width: 170,
      sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
      render: (name) => (
        <div className="department-name-cell">
          <ApartmentOutlined className="department-icon" />
          <span className="department-name">{name}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
      render: (description) => (
        <span className="description-text">
          {description || "No description"}
        </span>
      ),
    },
    {
      title: "Manager",
      dataIndex: "managerId",
      key: "manager",
      width: 200,
      render: (manager) =>
        manager?.personalInfo?.fullName ? (
          <div className="manager-cell">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="manager-avatar"
            />
            <span>{manager.personalInfo.fullName}</span>
          </div>
        ) : (
          <Tag color="default">No Manager</Tag>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 200,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            className="action-button edit-button"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Department"
            description="Are you sure to delete this department?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record._id);
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={(e) => e.stopPropagation()}
              className="action-button delete-button"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="department-management-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Department Management</h1>
          <p className="page-subtitle">
            Organize and manage company departments
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="add-button"
        >
          Add Department
        </Button>
      </div>

      {/* Table */}
      <Card className="table-card">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 6,
            showTotal: (total) => `Total ${total} departments`,
            showSizeChanger: false,
          }}
          locale={{ emptyText: "No departments found" }}
          className="department-table"
          onRow={(record) => ({
            onClick: () =>
              navigate(`/profile/departments/${record._id}/employees`, {
                state: {
                  departmentName: record.departmentName,
                  managerId: record.managerId?._id,
                },
              }),
            className: "clickable-row",
          })}
        />
      </Card>

      {/* Modals */}
      <AddDepartmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDepartments}
      />

      <EditDepartmentModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        departmentId={currentDepartmentId}
        onSuccess={fetchDepartments}
      />
    </div>
  );
};

export default DepartmentPage;
