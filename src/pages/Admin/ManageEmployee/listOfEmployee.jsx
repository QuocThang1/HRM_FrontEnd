import { Table, Button, Popconfirm, Card, Space, Tag, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { getStaffApi, deleteStaffApi } from "../../../utils/Api/staffApi";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    CrownOutlined,
} from "@ant-design/icons";
import AddEmployeeModal from "./addEmployeeModal";
import EditEmployeeModal from "./editEmployeeModal";
import { toast } from "react-toastify";
import "../../../styles/listOfEmployee.css";

const { Option } = Select;

const StaffPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentStaffId, setCurrentStaffId] = useState(null);
    const [selectedRole, setSelectedRole] = useState("all");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStaffs();
    }, []);

    const fetchStaffs = async () => {
        try {
            setLoading(true);
            const res = await getStaffApi();
            if (!res?.message) {
                setDataSource(res.data);
                setFilteredData(res.data);
            } else {
                toast.error(res?.EM || "Failed to fetch employees", { autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to fetch employees", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleRoleFilter = async (role) => {
        setSelectedRole(role);
        try {
            setLoading(true);
            if (role === "all") {
                setFilteredData(dataSource);
            } else {
                const res = await getStaffApi(role);
                if (!res?.message) {
                    setFilteredData(res.data);
                }
            }
        } catch (error) {
            console.error("Error filtering by role:", error);
            toast.error("Failed to filter employees", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setCurrentStaffId(record._id);
        setEditModalOpen(true);
    };

    const handleDelete = async (staffId) => {
        try {
            setLoading(true);
            const res = await deleteStaffApi(staffId);
            toast.success(res.EM || "Employee deleted successfully", { autoClose: 2000 });
            await fetchStaffs();
            if (selectedRole !== "all") {
                handleRoleFilter(selectedRole);
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Failed to delete employee", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const getRoleTag = (role) => {
        const roleConfig = {
            admin: { color: "#ff4d4f", icon: <SafetyCertificateOutlined /> },
            manager: { color: "#1890ff", icon: <CrownOutlined /> },
            staff: { color: "#52c41a", icon: <UserOutlined /> },
        };

        const config = roleConfig[role] || roleConfig.staff;

        return (
            <Tag color={config.color} icon={config.icon}>
                {role?.toUpperCase() || "STAFF"}
            </Tag>
        );
    };

    const getRoleCount = (role) => {
        return dataSource.filter((emp) => emp.role === role).length;
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "_id",
            key: "_id",
            width: 120,
            ellipsis: true,
            render: (id) => (
                <Tooltip title={id}>
                    <span className="employee-id">{id.substring(0, 8)}...</span>
                </Tooltip>
            ),
        },
        {
            title: "Full Name",
            dataIndex: ["personalInfo", "fullName"],
            key: "fullName",
            width: 200,
            sorter: (a, b) =>
                (a.personalInfo?.fullName || "").localeCompare(
                    b.personalInfo?.fullName || ""
                ),
        },
        {
            title: "Email",
            dataIndex: ["personalInfo", "email"],
            key: "email",
            width: 160,
            ellipsis: true,
            render: (email) => (
                <Tooltip title={email}>
                    <span className="employee-email">{email}</span>
                </Tooltip>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            width: 110,
            render: (role) => getRoleTag(role),
        },
        {
            title: "",
            key: "actions",
            width: 180,
            fixed: "right",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                        className="action-button edit-button"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Employee"
                        description="Are you sure to delete this employee?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
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
        <div className="employee-management-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Employee Management</h1>
                    <p className="page-subtitle">Manage and organize your workforce</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                    className="add-button"
                >
                    Add Employee
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
                <Card
                    className={`stat-card ${selectedRole === "all" ? "active" : ""}`}
                    hoverable
                    onClick={() => handleRoleFilter("all")}
                >
                    <div className="stat-icon all">
                        <TeamOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{dataSource.length}</div>
                        <div className="stat-label">Total Employees</div>
                    </div>
                </Card>

                <Card
                    className={`stat-card ${selectedRole === "admin" ? "active" : ""}`}
                    hoverable
                    onClick={() => handleRoleFilter("admin")}
                >
                    <div className="stat-icon admin">
                        <SafetyCertificateOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{getRoleCount("admin")}</div>
                        <div className="stat-label">Admins</div>
                    </div>
                </Card>

                <Card
                    className={`stat-card ${selectedRole === "manager" ? "active" : ""}`}
                    hoverable
                    onClick={() => handleRoleFilter("manager")}
                >
                    <div className="stat-icon manager">
                        <CrownOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{getRoleCount("manager")}</div>
                        <div className="stat-label">Managers</div>
                    </div>
                </Card>

                <Card
                    className={`stat-card ${selectedRole === "staff" ? "active" : ""}`}
                    hoverable
                    onClick={() => handleRoleFilter("staff")}
                >
                    <div className="stat-icon staff">
                        <UserOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{getRoleCount("staff")}</div>
                        <div className="stat-label">Staff Members</div>
                    </div>
                </Card>
            </div>

            {/* Filter Section */}
            <Card className="filter-card">
                <div className="filter-section">
                    <div className="filter-label">
                        <TeamOutlined /> Filter by Role:
                    </div>
                    <Select
                        value={selectedRole}
                        onChange={handleRoleFilter}
                        size="large"
                        className="role-select"
                        style={{ width: 200 }}
                    >
                        <Option value="all">All Roles</Option>
                        <Option value="admin">
                            <Space>
                                <SafetyCertificateOutlined style={{ color: "#ff4d4f" }} />
                                Admin
                            </Space>
                        </Option>
                        <Option value="manager">
                            <Space>
                                <CrownOutlined style={{ color: "#1890ff" }} />
                                Manager
                            </Space>
                        </Option>
                        <Option value="staff">
                            <Space>
                                <UserOutlined style={{ color: "#52c41a" }} />
                                Staff
                            </Space>
                        </Option>
                    </Select>
                </div>
            </Card>

            {/* Table */}
            <Card className="table-card">
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 6,
                        showTotal: (total) => `Total ${total} employees`,
                        showSizeChanger: false,
                    }}
                    locale={{ emptyText: "No employees found" }}
                    className="employee-table"
                />
            </Card>

            {/* Modals */}
            <AddEmployeeModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchStaffs();
                    if (selectedRole !== "all") {
                        handleRoleFilter(selectedRole);
                    }
                }}
            />

            <EditEmployeeModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                staffId={currentStaffId}
                onSuccess={() => {
                    fetchStaffs();
                    if (selectedRole !== "all") {
                        handleRoleFilter(selectedRole);
                    }
                }}
            />
        </div>
    );
};

export default StaffPage;