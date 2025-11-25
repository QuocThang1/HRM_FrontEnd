import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Tag, Spin, Typography, Space, Divider } from "antd";
import { ArrowLeftOutlined, CalendarOutlined } from "@ant-design/icons";
import { getPolicyByIdApi } from "../../../utils/Api/policyApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const PolicyDetail = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = {
    leave: { label: "Leave Policy", color: "blue" },
    salary: { label: "Salary Policy", color: "green" },
    working_hours: { label: "Working Hours", color: "orange" },
    benefits: { label: "Benefits", color: "purple" },
    discipline: { label: "Discipline", color: "red" },
    recruitment: { label: "Recruitment", color: "cyan" },
    general: { label: "General", color: "default" },
  };

  useEffect(() => {
    fetchPolicy();
  }, [policyId]);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const res = await getPolicyByIdApi(policyId);
      if (res.EC === 0 && res.data) {
        setPolicy(res.data);
      } else {
        toast.error(res.EM || "Failed to load policy");
      }
    } catch (error) {
      console.error("Error fetching policy:", error);
      toast.error("Failed to load policy");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="policy-detail-loading">
        <Spin size="large" tip="Loading policy..." />
      </div>
    );
  }

  if (!policy) {
    return null;
  }

  return (
    <div className="policy-detail-page">
      <div className="policy-detail-header">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          size="large"
        >
          Back to Policies
        </Button>
      </div>

      <Card className="policy-detail-card">
        {/* Header */}
        <div className="policy-header">
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Space wrap>
              <Tag
                color={categories[policy.category]?.color}
                style={{ fontSize: "14px", padding: "4px 12px" }}
              >
                {categories[policy.category]?.label}
              </Tag>
              <Tag
                color={policy.isActive ? "success" : "error"}
                style={{ fontSize: "14px", padding: "4px 12px" }}
              >
                {policy.isActive ? "Active" : "Inactive"}
              </Tag>
            </Space>

            <Title level={1} className="policy-title">
              {policy.title}
            </Title>

            <Space split={<Divider type="vertical" />} wrap>
              <Space>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <Text type="secondary">
                  Created: {dayjs(policy.createdAt).format("DD/MM/YYYY HH:mm")}
                </Text>
              </Space>
            </Space>
          </Space>
        </div>

        <Divider />

        {/* Content */}
        <div className="policy-content">
          <Paragraph
            style={{
              fontSize: "16px",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
              color: "#262626",
            }}
          >
            {policy.content}
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default PolicyDetail;
