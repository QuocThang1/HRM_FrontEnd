import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Select,
  DatePicker,
  Tag,
  Space,
  Typography,
  Alert,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  DollarOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getMonthlySalariesByMonthApi } from "../../../../utils/Api/monthlySalaryApi";
import { getDepartmentsApi } from "../../../../utils/Api/departmentApi";
import { getStaffApi } from "../../../../utils/Api/staffApi";

const { Option } = Select;
const { Title } = Typography;

const SalaryDashboard = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (allStaff.length > 0 && selectedMonth) {
      fetchSalaries();
    }
  }, [selectedMonth]);

  useEffect(() => {
    filterSalaries();
  }, [salaries, selectedDepartment]);

  const fetchInitialData = async () => {
    try {
      const [deptResponse, staffResponse] = await Promise.all([
        getDepartmentsApi(),
        getStaffApi(),
      ]);

      if (deptResponse?.EC === 0) {
        setDepartments(deptResponse.data);
      }

      if (staffResponse?.EC === 0) {
        setAllStaff(staffResponse.data);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const month = selectedMonth.month() + 1;
      const year = selectedMonth.year();
      const response = await getMonthlySalariesByMonthApi(month, year);

      if (response?.EC === 0) {
        const enrichedSalaries = response.data.map((salary) => {
          const salaryStaffId =
            typeof salary.staffId === "object"
              ? salary.staffId._id
              : salary.staffId;

          const staffInfo = allStaff.find(
            (staff) => staff._id === salaryStaffId,
          );

          if (staffInfo) {
            return {
              ...salary,
              staffId: staffInfo,
            };
          }
          return salary;
        });

        setSalaries(enrichedSalaries);
      } else {
        setSalaries([]);
      }
    } catch (error) {
      console.error("Error fetching salaries:", error);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSalaries = () => {
    if (selectedDepartment === "all") {
      setFilteredSalaries(salaries);
    } else {
      const filtered = salaries.filter((salary) => {
        const staff = salary.staffId;

        if (!staff || !staff.departmentId) {
          return false;
        }

        const staffDeptId =
          typeof staff.departmentId === "object"
            ? staff.departmentId._id
            : staff.departmentId;

        return staffDeptId === selectedDepartment;
      });

      setFilteredSalaries(filtered);
    }
  };

  const getRoleTag = (role) => {
    const roleConfig = {
      admin: { color: "red", text: "Admin" },
      manager: { color: "blue", text: "Manager" },
      staff: { color: "green", text: "Staff" },
    };
    const config = roleConfig[role] || roleConfig.staff;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getDepartmentName = (staff) => {
    if (!staff || !staff.departmentId) return "No Department";

    if (staff.departmentId.departmentName) {
      return staff.departmentId.departmentName;
    }

    const deptId =
      typeof staff.departmentId === "object"
        ? staff.departmentId._id
        : staff.departmentId;

    const dept = departments.find((d) => d._id === deptId);
    return dept?.departmentName || "N/A";
  };

  const calculateStatistics = () => {
    const total = filteredSalaries.reduce(
      (sum, salary) => sum + (salary.totalSalary || 0),
      0,
    );
    const totalHours = filteredSalaries.reduce(
      (sum, salary) => sum + (salary.totalHoursWorked || 0),
      0,
    );

    return { total, totalHours };
  };

  const stats = calculateStatistics();

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Employee Name",
      dataIndex: ["staffId", "personalInfo", "fullName"],
      key: "fullName",
      width: 200,
      fixed: "left",
      render: (text, record) => {
        return text || record.staffId?.personalInfo?.fullName || "N/A";
      },
    },
    {
      title: "Role",
      dataIndex: ["staffId", "role"],
      key: "role",
      width: 120,
      align: "center",
      render: (role, record) => {
        const staffRole = role || record.staffId?.role;
        return staffRole ? getRoleTag(staffRole) : <Tag>No Role</Tag>;
      },
    },
    {
      title: "Department",
      key: "department",
      width: 150,
      render: (_, record) => {
        const deptName = getDepartmentName(record.staffId);
        return <span>{deptName}</span>;
      },
    },
    {
      title: "Hourly Rate",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      width: 150,
      align: "right",
      render: (rate) => formatCurrency(rate || 0),
    },
    {
      title: "Total Hours",
      dataIndex: "totalHoursWorked",
      key: "totalHoursWorked",
      width: 120,
      align: "center",
      render: (hours) => `${(hours || 0).toFixed(1)}h`,
    },
    {
      title: "Base Salary",
      dataIndex: "baseSalary",
      key: "baseSalary",
      width: 150,
      align: "right",
      render: (salary) => formatCurrency(salary || 0),
    },
    {
      title: "Bonus",
      dataIndex: "bonus",
      key: "bonus",
      width: 120,
      align: "right",
      render: (bonus) => (
        <span style={{ color: "#10b981" }}>+{formatCurrency(bonus || 0)}</span>
      ),
    },
    {
      title: "Deduction",
      dataIndex: "deduction",
      key: "deduction",
      width: 120,
      align: "right",
      render: (deduction) => (
        <span style={{ color: "#ef4444" }}>
          -{formatCurrency(deduction || 0)}
        </span>
      ),
    },
    {
      title: "Total Salary",
      dataIndex: "totalSalary",
      key: "totalSalary",
      width: 150,
      align: "right",
      fixed: "right",
      render: (total) => (
        <strong style={{ color: "#2c3e50" }}>
          {formatCurrency(total || 0)}
        </strong>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f6f9fb", minHeight: "100vh" }}>
      <div className="page-header">
        <Title level={2} className="page-title">
          <DollarOutlined /> Monthly Salary Dashboard
        </Title>
        <div className="page-subtitle">
          Manage and track employee monthly salaries
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Salary"
              value={stats.total}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#2c3e50" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Number of Employees"
              value={filteredSalaries.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#3498db" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Hours"
              value={stats.totalHours}
              precision={1}
              suffix="h"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Space size="large" wrap>
          <Space direction="vertical" size={4}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              <CalendarOutlined /> Select Month
            </span>
            <DatePicker
              picker="month"
              value={selectedMonth}
              onChange={setSelectedMonth}
              format="MM/YYYY"
              style={{ width: 200 }}
              placeholder="Select month"
            />
          </Space>

          <Space direction="vertical" size={4}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              <TeamOutlined /> Department
            </span>
            <Select
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              style={{ width: 200 }}
              placeholder="Select department"
            >
              <Option value="all">All Departments</Option>
              {departments.map((dept) => (
                <Option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </Option>
              ))}
            </Select>
          </Space>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredSalaries}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 1500, y: 600 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} employees`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          locale={{
            emptyText: (
              <Alert
                message="No Data"
                description={
                  selectedMonth
                    ? "No salary records created for this month yet"
                    : "Please select a month to view salary data"
                }
                type="info"
                showIcon
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default SalaryDashboard;
