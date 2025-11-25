import { useState, useEffect } from "react";
import {
  Card,
  Descriptions,
  Button,
  Space,
  Typography,
  Tag,
  Popconfirm,
  Spin,
  Form,
} from "antd";
import {
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { detailStaffApi } from "../../../../utils/Api/staffApi";
import {
  getSalaryByStaffApi,
  createSalaryApi,
  updateSalaryApi,
  deleteSalaryApi,
} from "../../../../utils/Api/salaryApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import SalaryModal from "./salaryModal";
import "../../../../styles/staffSalaryDetail.css";

const { Title, Text } = Typography;

const StaffSalaryDetail = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState(null);
  const [salary, setSalary] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStaffDetail();
    fetchSalary();
  }, [staffId]);

  const fetchStaffDetail = async () => {
    try {
      setLoading(true);
      const res = await detailStaffApi(staffId);
      if (res && res.EC === 0 && res.data) {
        setStaff(res.data);
      } else {
        toast.error(res?.EM || "Failed to fetch staff details");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("An error occurred while fetching staff details");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalary = async () => {
    try {
      const res = await getSalaryByStaffApi(staffId);
      if (res && res.EC === 0 && res.data) {
        setSalary(res.data);
      }
    } catch (error) {
      console.error("Error fetching salary:", error);
    }
  };

  const handleCreateSalary = () => {
    setModalType("create");
    form.resetFields();
    setModalVisible(true);
  };

  const handleUpdateSalary = () => {
    setModalType("update");
    form.setFieldsValue({
      hourlyRate: salary?.hourlyRate || 0,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      let res;
      if (modalType === "create") {
        res = await createSalaryApi(staffId, values.hourlyRate);
      } else {
        res = await updateSalaryApi(salary._id, values.hourlyRate);
      }

      if (res && res.EC === 0) {
        toast.success(
          res.EM ||
            `Salary ${modalType === "create" ? "created" : "updated"} successfully`,
        );
        setModalVisible(false);
        form.resetFields();
        fetchSalary();
      } else {
        toast.error(res?.EM || `Failed to ${modalType} salary`);
      }
    } catch (error) {
      console.error(`Error ${modalType} salary:`, error);
      toast.error(`An error occurred while ${modalType}ing salary`);
    }
  };

  const handleDeleteSalary = async () => {
    try {
      const res = await deleteSalaryApi(salary._id);
      if (res && res.EC === 0) {
        toast.success(res.EM || "Salary deleted successfully");
        setSalary(null);
      } else {
        toast.error(res?.EM || "Failed to delete salary");
      }
    } catch (error) {
      console.error("Error deleting salary:", error);
      toast.error("An error occurred while deleting salary");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Loading staff details..." />
      </div>
    );
  }

  if (!staff) {
    return (
      <Card>
        <Text>Staff not found</Text>
      </Card>
    );
  }

  return (
    <div className="staff-salary-detail-page">
      <div className="page-header">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            size="large"
          >
            Back
          </Button>
          <div>
            <h1 className="page-title">
              <UserOutlined /> Staff Salary Details
            </h1>
            <p className="page-subtitle">
              Manage salary information for {staff.personalInfo?.fullName}
            </p>
          </div>
        </Space>
      </div>

      {/* Staff Information Card */}
      <Card className="info-card" title="Personal Information">
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Full Name" span={2}>
            <Text strong style={{ fontSize: 16 }}>
              {staff.personalInfo?.fullName || "N/A"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <MailOutlined /> Email
              </>
            }
          >
            {staff.personalInfo?.email || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <PhoneOutlined /> Phone
              </>
            }
          >
            {staff.personalInfo?.phone || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <HomeOutlined /> Address
              </>
            }
            span={2}
          >
            {staff.personalInfo?.address || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <IdcardOutlined /> Citizen ID
              </>
            }
          >
            {staff.personalInfo?.citizenId || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {staff.personalInfo?.gender || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {staff.personalInfo?.dob
              ? dayjs(staff.personalInfo.dob).format("DD/MM/YYYY")
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color="blue">{staff.role?.toUpperCase() || "N/A"}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Salary Information Card */}
      <Card
        className="salary-card"
        title={
          <Space>
            <DollarOutlined />
            <span>Salary Information</span>
          </Space>
        }
        extra={
          salary ? (
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleUpdateSalary}
              >
                Update Salary
              </Button>
              <Popconfirm
                title="Delete Salary"
                description="Are you sure you want to delete this salary information?"
                onConfirm={handleDeleteSalary}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateSalary}
            >
              Create Salary
            </Button>
          )
        }
      >
        {salary ? (
          <div className="salary-info">
            <div className="salary-display">
              <div className="salary-amount">
                <DollarOutlined className="salary-icon" />
                <div>
                  <Text
                    style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}
                  >
                    Hourly Rate
                  </Text>
                  <Title level={2} style={{ margin: 0, color: "white" }}>
                    ${salary.hourlyRate.toLocaleString()}/hour
                  </Title>
                </div>
              </div>
              <div className="salary-meta">
                <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                  Created: {dayjs(salary.createdAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </div>
            </div>

            {/* Estimated Monthly Salary */}
            <div className="estimated-salary">
              <Card size="small" style={{ background: "#f6f9fb" }}>
                <Space direction="vertical" size="small">
                  <Text strong>Estimated Monthly Salary</Text>
                  <Text style={{ fontSize: 18, color: "#1890ff" }}>
                    ${(salary.hourlyRate * 160).toLocaleString()}
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {" "}
                      (based on 160 hours/month)
                    </Text>
                  </Text>
                </Space>
              </Card>
            </div>
          </div>
        ) : (
          <div className="no-salary">
            <Space direction="vertical" align="center" size="large">
              <DollarOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />
              <Text type="secondary" style={{ fontSize: 16 }}>
                No salary information available
              </Text>
              <Text type="secondary">
                Click Create Salary to set hourly rate for this staff
              </Text>
            </Space>
          </div>
        )}
      </Card>

      {/* Modal */}
      <SalaryModal
        visible={modalVisible}
        type={modalType}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        form={form}
      />
    </div>
  );
};

export default StaffSalaryDetail;
