import { useState, useEffect, useMemo } from "react";
import { Table, Card, Select, Space, Typography, Tag, Alert, Spin } from "antd";
import {
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  getManagerDepartmentApi,
  getDepartmentReviewsApi,
} from "../../../utils/Api/departmentApi";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

const ReviewDepartment = () => {
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [department, setDepartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deptLoading, setDeptLoading] = useState(false);

  const fetchDepartment = async () => {
    try {
      setDeptLoading(true);
      const res = await getManagerDepartmentApi();
      if (res && res.data) {
        setDepartment(res.data);
      }
    } catch (error) {
      console.error("Error fetching department:", error);
    } finally {
      setDeptLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!department?._id) return;

    try {
      setLoading(true);
      const res = await getDepartmentReviewsApi(department._id);
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  useEffect(() => {
    if (department?._id) {
      fetchReviews();
    }
  }, [department?._id]);

  const filteredReviews = useMemo(() => {
    if (selectedMonth === "all") {
      return reviews;
    }
    return reviews.filter((review) => review.month === selectedMonth);
  }, [reviews, selectedMonth]);

  const monthOptions = useMemo(() => {
    const monthsSet = new Set();
    reviews.forEach((review) => {
      if (review.month) {
        monthsSet.add(review.month);
      }
    });
    return Array.from(monthsSet).sort((a, b) => {
      return new Date(b) - new Date(a);
    });
  }, [reviews]);

  const formatMonthDisplay = (monthString) => {
    if (!monthString) return "N/A";
    const [year, month] = monthString.split("-");
    return `${month}/${year}`;
  };

  const getRatingTag = (score) => {
    let color = "default";
    if (score >= 8) color = "success";
    else if (score >= 6) color = "processing";
    else if (score >= 4) color = "warning";
    else color = "error";

    return (
      <Tag color={color} icon={<StarOutlined />}>
        {score?.toFixed(1) || 0} / 10
      </Tag>
    );
  };

  const stats = useMemo(() => {
    if (filteredReviews.length === 0) {
      return {
        total: 0,
        averageScore: 0,
        excellent: 0,
        good: 0,
        average: 0,
        poor: 0,
      };
    }

    const total = filteredReviews.length;
    const sumScore = filteredReviews.reduce(
      (sum, review) => sum + (review.score || 0),
      0,
    );
    const averageScore = sumScore / total;

    const excellent = filteredReviews.filter((r) => r.score >= 8).length;
    const good = filteredReviews.filter(
      (r) => r.score >= 6 && r.score < 8,
    ).length;
    const average = filteredReviews.filter(
      (r) => r.score >= 4 && r.score < 6,
    ).length;
    const poor = filteredReviews.filter((r) => r.score < 4).length;

    return { total, averageScore, excellent, good, average, poor };
  }, [filteredReviews]);

  const columns = [
    {
      title: "No.",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Reviewer",
      key: "reviewer",
      width: 200,
      render: (record) => (
        <Space>
          <UserOutlined
            style={{
              fontSize: 16,
              color: "#3498db",
            }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.adminId?.personalInfo?.fullName || "N/A"}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.adminId?.personalInfo?.email || ""}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      width: 120,
      align: "center",
      render: (month) => (
        <Tag color="blue">
          <CalendarOutlined /> {formatMonthDisplay(month)}
        </Tag>
      ),
      sorter: (a, b) => {
        return new Date(a.month) - new Date(b.month);
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      width: 130,
      align: "center",
      render: (score) => getRatingTag(score),
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      ellipsis: true,
      render: (text) => (
        <Text ellipsis={{ tooltip: text }}>{text || "No comments"}</Text>
      ),
    },
    {
      title: "Review Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      align: "center",
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).format("HH:mm")}
          </Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  if (deptLoading) {
    return (
      <div
        style={{ padding: "24px", background: "#f6f9fb", minHeight: "100vh" }}
      >
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div
        style={{ padding: "24px", background: "#f6f9fb", minHeight: "100vh" }}
      >
        <Alert
          message="No Department Assigned"
          description="You are not assigned to any department as a manager."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        background: "#f6f9fb",
        minHeight: "100vh",
      }}
    >
      <div className="page-header">
        <Title level={2} className="page-title">
          <FileTextOutlined /> Department Reviews
        </Title>
        <div className="page-subtitle">
          Reviews for {department.departmentName}
        </div>
      </div>

      <div className="stats-cards">
        <Card className="stat-card">
          <div className="stat-icon all">
            <FileTextOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon approved">
            <StarOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageScore.toFixed(1)}</div>
            <div className="stat-label">Average Score (out of 10)</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon pending">
            <StarOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.excellent}</div>
            <div className="stat-label">Excellent (8-10)</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon rejected">
            <StarOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.poor}</div>
            <div className="stat-label">Need Improvement (&lt;4)</div>
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space size="large" wrap>
            <Space direction="vertical" size={4}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <CalendarOutlined /> Select Month
              </span>
              <Select
                value={selectedMonth}
                onChange={setSelectedMonth}
                style={{ width: 200 }}
                placeholder="Select month"
              >
                <Option value="all">All Months</Option>
                {monthOptions.map((month) => (
                  <Option key={month} value={month}>
                    {formatMonthDisplay(month)}
                  </Option>
                ))}
              </Select>
            </Space>
          </Space>

          {selectedMonth !== "all" && (
            <Alert
              message={`Showing reviews for ${formatMonthDisplay(
                selectedMonth,
              )}`}
              type="info"
              showIcon
            />
          )}
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredReviews}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reviews`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{
            emptyText: (
              <Alert
                message="No Reviews"
                description={
                  selectedMonth === "all"
                    ? "No reviews found for this department"
                    : `No reviews found for ${formatMonthDisplay(
                        selectedMonth,
                      )}`
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

export default ReviewDepartment;
