import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Tag,
  Spin,
  Typography,
  Descriptions,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getContractByIdApi } from "../../../utils/Api/contractApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

const ContractDetailPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractDetail();
    // eslint-disable-next-line
  }, [contractId]);

  const fetchContractDetail = async () => {
    try {
      setLoading(true);
      const res = await getContractByIdApi(contractId);
      if (res && res.EC === 0) {
        setContract(res.data);
      } else {
        toast.error(res?.EM || "Failed to fetch contract details", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Cannot fetch contract details", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      active: {
        color: "success",
        icon: <CheckCircleOutlined />,
        text: "ACTIVE",
      },
      expired: {
        color: "error",
        icon: <CloseCircleOutlined />,
        text: "EXPIRED",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag
        color={config.color}
        icon={config.icon}
        style={{ fontSize: 16, padding: "8px 16px" }}
      >
        {config.text}
      </Tag>
    );
  };

  if (loading) {
    return (
      <div className="contract-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contract-detail-page">
        <Card>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Title level={4}>Contract not found</Title>
            <Button type="primary" onClick={() => navigate("-1")}>
              Back to Contracts
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="contract-detail-page">
      <div className="contract-detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          size="large"
        >
          Back to Contracts
        </Button>
      </div>

      <Card className="contract-detail-card">
        <div className="contract-header">
          <CalendarOutlined
            style={{ fontSize: 48, color: "#3498db", marginBottom: 16 }}
          />
          <Title level={2} className="contract-title">
            Employment Contract
          </Title>
          <div style={{ marginBottom: 24 }}>
            {getStatusTag(contract.status)}
          </div>
        </div>

        <Divider />

        <Descriptions
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          size="middle"
        >
          <Descriptions.Item label="Start Date">
            {dayjs(contract.fromDate).format("DD/MM/YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label="End Date">
            {dayjs(contract.toDate).format("DD/MM/YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label="Duration" span={2}>
            {dayjs(contract.toDate).diff(dayjs(contract.fromDate), "month")}{" "}
            months
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {getStatusTag(contract.status)}
          </Descriptions.Item>

          <Descriptions.Item label="Created Date">
            {dayjs(contract.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>

          {contract.updatedAt && (
            <Descriptions.Item label="Last Updated" span={2}>
              {dayjs(contract.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider orientation="left" style={{ marginTop: 32 }}>
          <strong>Contract Content</strong>
        </Divider>

        <div className="contract-content">
          <Paragraph
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre-wrap",
            }}
          >
            {contract.content || "No content available"}
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default ContractDetailPage;
