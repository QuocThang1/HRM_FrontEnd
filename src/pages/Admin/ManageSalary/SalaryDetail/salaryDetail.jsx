import { useState, useEffect } from "react";
import {
    Card,
    Table,
    Select,
    Typography,
    Space,
    Button,
    Tag,
    Empty,
} from "antd";
import {
    DollarOutlined,
    EyeOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { getDepartmentsApi } from "../../../../utils/Api/departmentApi";
import { getStaffByDepartmentApi } from "../../../../utils/Api/staffApi";
import { getAllSalariesApi } from "../../../../utils/Api/salaryApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;

const SalaryDetail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [filteredStaffList, setFilteredStaffList] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [salaryFilter, setSalaryFilter] = useState("all"); // 'all', 'set', 'not-set'

    useEffect(() => {
        fetchDepartments();
        fetchAllSalaries();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchStaffByDepartment(selectedDepartment);
        } else {
            setStaffList([]);
            setFilteredStaffList([]);
        }
    }, [selectedDepartment]);

    useEffect(() => {
        filterStaffBySalary();
    }, [staffList, salaryFilter]);

    const fetchDepartments = async () => {
        try {
            const res = await getDepartmentsApi();
            if (res && res.EC === 0 && res.data) {
                setDepartments(res.data);
            } else {
                toast.error(res?.EM || "Failed to fetch departments");
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast.error("An error occurred while fetching departments");
        }
    };

    const fetchAllSalaries = async () => {
        try {
            const res = await getAllSalariesApi();
            if (res && res.EC === 0 && res.data) {
                setSalaries(res.data);
            }
        } catch (error) {
            console.error("Error fetching salaries:", error);
        }
    };

    const fetchStaffByDepartment = async (departmentId) => {
        try {
            setLoading(true);
            const res = await getStaffByDepartmentApi(departmentId);
            if (res && res.EC === 0 && res.data) {
                setStaffList(res.data);
            } else {
                toast.error(res?.EM || "Failed to fetch staff");
            }
        } catch (error) {
            console.error("Error fetching staff:", error);
            toast.error("An error occurred while fetching staff");
        } finally {
            setLoading(false);
        }
    };

    const getSalaryByStaffId = (staffId) => {
        const salary = salaries.find((s) => s.staffId?._id === staffId || s.staffId === staffId);
        return salary?.hourlyRate || null;
    };

    const filterStaffBySalary = () => {
        if (salaryFilter === "all") {
            setFilteredStaffList(staffList);
        } else if (salaryFilter === "set") {
            setFilteredStaffList(
                staffList.filter((staff) => getSalaryByStaffId(staff._id) !== null)
            );
        } else if (salaryFilter === "not-set") {
            setFilteredStaffList(
                staffList.filter((staff) => getSalaryByStaffId(staff._id) === null)
            );
        }
    };

    const handleViewDetail = (staffId) => {
        navigate(`/profile/salary-management/${staffId}`);
    };

    const handleStatCardClick = (filter) => {
        setSalaryFilter(filter);
    };

    const columns = [
        {
            title: "Staff Information",
            key: "staff",
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 16 }}>
                        {record.personalInfo?.fullName || "N/A"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        <UserOutlined /> {record.personalInfo?.email || ""}
                    </Text>
                </Space>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            align: "center",
            render: (role) => <Tag color="blue">{role?.toUpperCase() || "N/A"}</Tag>,
            width: 120,
        },
        {
            title: "Hourly Rate",
            key: "hourlyRate",
            align: "center",
            render: (_, record) => {
                const hourlyRate = getSalaryByStaffId(record._id);
                return hourlyRate ? (
                    <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                        ${hourlyRate.toLocaleString()}/h
                    </Text>
                ) : (
                    <Tag color="orange">Not Set</Tag>
                );
            },
            width: 150,
        },
        {
            title: "",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record._id)}
                >
                    View Details
                </Button>
            ),
            width: 150,
        },
    ];

    const selectedDept = departments.find((d) => d._id === selectedDepartment);
    const totalStaff = staffList.length;
    const staffWithSalary = staffList.filter((staff) =>
        getSalaryByStaffId(staff._id)
    ).length;
    const staffWithoutSalary = totalStaff - staffWithSalary;

    return (
        <div className="salary-detail-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        <DollarOutlined /> Salary Management
                    </h1>
                    <p className="page-subtitle">
                        View and manage employee salaries by department
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <Card className="filter-card">
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Text strong style={{ fontSize: 16 }}>
                        <TeamOutlined /> Select Department
                    </Text>
                    <Select
                        placeholder="Choose a department to view staff salaries"
                        style={{ width: "100%" }}
                        size="large"
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {departments.map((dept) => (
                            <Option key={dept._id} value={dept._id}>
                                {dept.departmentName}
                            </Option>
                        ))}
                    </Select>
                </Space>
            </Card>

            {/* Stats Cards */}
            {selectedDepartment && (
                <div className="stats-cards">
                    <Card
                        className={`stat-card ${salaryFilter === "all" ? "active" : ""}`}
                        hoverable
                        onClick={() => handleStatCardClick("all")}
                    >
                        <div className="stat-icon all">
                            <TeamOutlined />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{totalStaff}</div>
                            <div className="stat-label">Total Staff</div>
                        </div>
                    </Card>

                    <Card
                        className={`stat-card ${salaryFilter === "set" ? "active" : ""}`}
                        hoverable
                        onClick={() => handleStatCardClick("set")}
                    >
                        <div className="stat-icon approved">
                            <DollarOutlined />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{staffWithSalary}</div>
                            <div className="stat-label">Salary Set</div>
                        </div>
                    </Card>

                    <Card
                        className={`stat-card ${salaryFilter === "not-set" ? "active" : ""}`}
                        hoverable
                        onClick={() => handleStatCardClick("not-set")}
                    >
                        <div className="stat-icon pending">
                            <UserOutlined />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{staffWithoutSalary}</div>
                            <div className="stat-label">Salary Not Set</div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Staff Table */}
            {selectedDepartment ? (
                <Card
                    className="table-card"
                    title={
                        <Space>
                            <TeamOutlined />
                            <span>
                                Staff List - {selectedDept?.departmentName || "Department"}
                            </span>
                        </Space>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={filteredStaffList}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 4,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} staff members`,
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No staff found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            ),
                        }}
                    />
                </Card>
            ) : (
                <Card className="empty-state-card">
                    <Empty
                        description={
                            <Space direction="vertical" size="small">
                                <Text type="secondary" style={{ fontSize: 16 }}>
                                    Please select a department to view staff salaries
                                </Text>
                                <Text type="secondary">
                                    Use the dropdown above to choose a department
                                </Text>
                            </Space>
                        }
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            )}
        </div>
    );
};

export default SalaryDetail;