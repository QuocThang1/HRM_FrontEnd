import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Space,
  Typography,
  Alert,
  Avatar,
  Tag,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { getDepartmentsApi } from "../../../../utils/Api/departmentApi";
import { getStaffByDepartmentApi, getStaffApi } from "../../../../utils/Api/staffApi";
import { getAllSalariesApi } from "../../../../utils/Api/salaryApi";
import CreateSalaryModal from "./createSalaryModal";
import { toast } from "react-toastify";

const { Option } = Select;
const { Title, Text } = Typography;

const CreateSalaryByMonth = () => {
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("all"); // Set default to "all"
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchAllStaff(); // Fetch all staff on mount
  }, []);

  useEffect(() => {
    fetchAllSalaries();
    if (selectedDepartment === "all") {
      fetchAllStaff();
    } else if (selectedDepartment) {
      fetchStaffByDepartment();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    filterStaff();
  }, [staffList, searchText]);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartmentsApi();
      if (response?.EC === 0) {
        setDepartments(response.data);
      }
    } catch (error) {
      toast.error("Error loading department list", { autoClose: 2000 });
    }
  };

  const fetchAllStaff = async () => {
    try {
      setLoading(true);
      const response = await getStaffApi();
      if (response?.EC === 0) {
        const listStaff = response.data.filter(
          (staff) => staff.departmentId !== null
        )
        const filteredStaff = listStaff.filter(
          (staff) => staff.role === "staff" || staff.role === "manager"
        );
        setStaffList(filteredStaff);
      }
    } catch (error) {
      toast.error("Error loading employee list", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSalaries = async () => {
    try {
      const response = await getAllSalariesApi();
      if (response?.EC === 0) {
        setSalaries(response.data);
      }
    } catch (error) {
      toast.error("Error loading salaries", { autoClose: 2000 });
    }
  };

  const getSalaryByStaffId = (staffId) => {
    const salary = salaries.find((s) => s.staffId?._id === staffId || s.staffId === staffId);
    return salary?.hourlyRate || null;
  };

  const fetchStaffByDepartment = async () => {
    try {
      setLoading(true);
      const response = await getStaffByDepartmentApi(selectedDepartment);
      if (response?.EC === 0) {
        setStaffList(response.data);
      }
    } catch (error) {
      toast.error("Error loading employee list", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    if (!searchText) {
      setFilteredStaffList(staffList);
    } else {
      const filtered = staffList.filter((staff) =>
        staff.personalInfo.fullName
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      );
      setFilteredStaffList(filtered);
    }
  };

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setModalVisible(true);
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

  const columns = [
    {
      title: "Employee",
      key: "employee",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            style={{
              background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
            }}
            icon={<UserOutlined />}
          />
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 16 }}>
              {record.personalInfo.fullName}
            </Text>
            <Text type="secondary">{record.personalInfo.email}</Text>
          </Space>
        </Space>
      ),
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
      title: "Department",
      key: "department",
      align: "center",
      render: (_, record) => (
        <Tag color="geekblue">
          {record.departmentId?.departmentName || "No Department"}
        </Tag>
      ),
      width: 180,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => getRoleTag(role),
      width: 120,
    },
    {
      title: "Phone",
      dataIndex: ["personalInfo", "phone"],
      key: "phone",
      align: "center",
      width: 150,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f6f9fb", minHeight: "100vh" }}>
      <div className="page-header">
        <Title level={2} className="page-title">
          <PlusCircleOutlined /> Create Monthly Salary
        </Title>
        <div className="page-subtitle">
          Select employee and create salary for specific month
        </div>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space size="large" wrap>
            <Space direction="vertical" size={4}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                <TeamOutlined /> Department
              </span>
              <Select
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                style={{ width: 250 }}
                placeholder="Select department"
              >
                <Option key="all" value="all">
                  All Departments
                </Option>
                {departments.map((dept) => (
                  <Option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </Option>
                ))}
              </Select>
            </Space>

            <Space direction="vertical" size={4}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                <SearchOutlined /> Search
              </span>
              <Input
                placeholder="Search by employee name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
              />
            </Space>
          </Space>

          <Alert
            message={`Found ${filteredStaffList.length} employees`}
            type="info"
            showIcon
          />
        </Space>
      </Card>

      <Card title="Employee List" loading={loading}>
        <Table
          columns={columns}
          dataSource={filteredStaffList}
          rowKey="_id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleStaffClick(record),
            style: { cursor: "pointer" },
          })}
          rowClassName="hoverable-row"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} employees`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{
            emptyText: "No employees found",
          }}
        />
      </Card>

      <CreateSalaryModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        staff={selectedStaff}
        departmentId={selectedDepartment === "all" ? null : selectedDepartment}
        onSuccess={selectedDepartment === "all" ? fetchAllStaff : fetchStaffByDepartment}
        onSuccessCallback={selectedDepartment === "all" ? fetchAllStaff : fetchStaffByDepartment}
      />
    </div>
  );
};

export default CreateSalaryByMonth;