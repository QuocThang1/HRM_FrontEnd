import { useState, useEffect } from "react";
import { Table, Card, Select, Typography, Alert, Space, Tag } from "antd";
import { FileTextOutlined, TeamOutlined } from "@ant-design/icons";
import { getStaffApi } from "../../../utils/Api/staffApi";
import { getDepartmentsApi } from "../../../utils/Api/departmentApi";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const ListOfContract = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterStaffByDepartment();
  }, [selectedDepartment, staffList]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [deptResponse, staffResponse] = await Promise.all([
        getDepartmentsApi(),
        getStaffApi(),
      ]);

      if (deptResponse?.EC === 0) {
        setDepartments(deptResponse.data);
      }

      if (staffResponse?.EC === 0 && Array.isArray(staffResponse.data)) {
        const filteredStaff = staffResponse.data.filter(
          (staff) => staff.role === "staff" || staff.role === "manager",
        );
        setStaffList(filteredStaff);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterStaffByDepartment = () => {
    if (selectedDepartment === "all") {
      setFilteredStaffList(staffList);
    } else if (selectedDepartment === "no-department") {
      setFilteredStaffList(staffList.filter((staff) => !staff.departmentId));
    } else {
      setFilteredStaffList(
        staffList.filter(
          (staff) => staff.departmentId?._id === selectedDepartment,
        ),
      );
    }
  };

  const handleRowClick = (staffId) => {
    navigate(`/profile/contract-management/staff/${staffId}`);
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
      key: "fullName",
      width: 120,
      render: (record) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5",
          }}
        >
          {record.personalInfo.fullName}
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      width: 100,
      render: (record) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.5",
          }}
        >
          {record.personalInfo.email}
        </div>
      ),
    },
    {
      title: "Department",
      width: 80,
      align: "center",
      render: (record) => {
        const deptName = record.departmentId?.departmentName || "No Department";
        return (
          <Tag color={deptName === "No Department" ? "default" : "blue"}>
            {deptName}
          </Tag>
        );
      },
    },
    {
      title: "Role",
      key: "role",
      width: 100,
      align: "center",
      render: (record) => (
        <Tag color={record.role === "manager" ? "gold" : "green"}>
          {record.role?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div className="list-contract-page">
      <div className="page-header">
        <Title level={2} className="page-title">
          <FileTextOutlined /> Staff Contracts Management
        </Title>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Space size="large" wrap style={{ width: "100%" }}>
          <Space direction="vertical" size={4}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              Filter by Department
            </span>
            <Select
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              style={{ width: 250 }}
              placeholder="Select department"
            >
              <Option value="all">All Departments</Option>
              <Option value="no-department">No Department</Option>
              {departments.map((dept) => (
                <Option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </Option>
              ))}
            </Select>
          </Space>

          {selectedDepartment !== "all" && (
            <Alert
              message={`Showing staff for: ${
                selectedDepartment === "no-department"
                  ? "No Department"
                  : departments.find((d) => d._id === selectedDepartment)
                      ?.departmentName || ""
              }`}
              type="info"
              showIcon
            />
          )}
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredStaffList}
          loading={loading}
          rowKey="_id"
          onRow={(record) => ({
            onClick: () => handleRowClick(record._id),
            style: { cursor: "pointer" },
          })}
          pagination={{
            pageSize: 4,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} staff members`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{
            emptyText: (
              <Alert
                message="No Staff Found"
                description={
                  selectedDepartment === "all"
                    ? "No staff members found"
                    : `No staff found for selected department`
                }
                type="info"
                showIcon
                icon={<TeamOutlined />}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default ListOfContract;
