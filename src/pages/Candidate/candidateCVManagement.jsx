import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Select,
  Space,
  Card,
  Modal,
  Spin,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  RobotOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  getAllCandidatesApi,
  updateCandidateStatusApi,
  autoScreenCVApi,
  deleteCVApi,
} from "../../utils/Api/candidateApi";
import CandidateDetailModal from "./candidateDetailModal";
import AIScreenResultModal from "./aiScreenResultModal";
import "../../styles/candidateCVManagement.css";

const { Option } = Select;

const CandidateCVManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiScreenLoading, setAiScreenLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [aiResultModalOpen, setAiResultModalOpen] = useState(false);
  const [aiScreenResult, setAiScreenResult] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidatesByStatus();
    // eslint-disable-next-line
  }, [statusFilter, candidates]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await getAllCandidatesApi();
      setCandidates(res.data);
    } catch (error) {
      toast.error("Failed to fetch candidates. Please try again.", {
        autoClose: 2000,
      });
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidatesByStatus = () => {
    if (statusFilter === "all") {
      setFilteredCandidates(candidates);
    } else {
      setFilteredCandidates(
        candidates.filter((c) => c.candidateInfo?.status === statusFilter),
      );
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      setLoading(true);
      const res = await updateCandidateStatusApi(candidateId, newStatus);

      if (res && res.EC === 0) {
        toast.success(res.EM, { autoClose: 2000 });
        await fetchCandidates();
      } else {
        toast.error(res.EM || "Failed to update candidate status", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(
        "An error occurred while updating status. Please try again.",
        { autoClose: 2000 },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAIScreen = async (candidate) => {
    if (!candidate.candidateInfo?.cvUrl) {
      toast.error("Candidate has not submitted CV yet", { autoClose: 2000 });
      return;
    }

    if (candidate.candidateInfo?.status !== "pending") {
      toast.warning("Can only screen candidates with pending status", {
        autoClose: 2000,
      });
      return;
    }

    Modal.confirm({
      title: "AI CV Screening",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>AI will analyze the CV and check for required fields:</p>
          <ul style={{ marginTop: 12 }}>
            <li>Full Name</li>
            <li>Email</li>
            <li>Phone Number</li>
            <li>Citizen ID</li>
            <li>Date of Birth</li>
            <li>Gender</li>
            <li>Address</li>
          </ul>
          <p style={{ marginTop: 12, color: "#ff4d4f", fontWeight: 500 }}>
            If any required field is missing, the CV will be automatically
            rejected.
          </p>
        </div>
      ),
      okText: "Start AI Screening",
      cancelText: "Cancel",
      width: 500,
      onOk: async () => {
        await performAIScreen(candidate);
      },
    });
  };

  const performAIScreen = async (candidate) => {
    try {
      setAiScreenLoading(true);
      toast.info(" AI is analyzing CV... Please wait", {
        autoClose: 3000,
      });

      const requiredFields = {
        fullName: candidate.personalInfo?.fullName || null,
        email: candidate.personalInfo?.email || null,
        phone: candidate.personalInfo?.phone || null,
        citizenId: candidate.personalInfo?.citizenId || null,
        dob: candidate.personalInfo?.dob || null,
        gender: candidate.personalInfo?.gender || null,
        address: candidate.personalInfo?.address || null,
      };

      const res = await autoScreenCVApi(candidate._id, requiredFields);

      if (res && res.EC === 0) {
        setAiScreenResult(res.data);
        setAiResultModalOpen(true);

        await fetchCandidates();

        if (res.data.aiAnalysis.shouldReject) {
          toast.error(" CV rejected by AI: Missing required fields", {
            autoClose: 3000,
          });
        } else {
          toast.success(" CV passed AI screening", {
            autoClose: 3000,
          });
        }
      } else {
        toast.error(res?.EM || "AI screening failed", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("AI Screen Error:", error);
      toast.error("Failed to perform AI screening. Please try again.", {
        autoClose: 2000,
      });
    } finally {
      setAiScreenLoading(false);
    }
  };

  const handleViewCV = (candidate) => {
    setSelectedCandidate(candidate);
    setViewModalOpen(true);
  };

  const handleDeleteCV = async (candidate) => {
    try {
      setLoading(true);
      const res = await deleteCVApi(candidate._id);

      if (res && res.EC === 0) {
        toast.success("CV deleted successfully");
        await fetchCandidates();
      } else {
        toast.error(res?.EM || "Failed to delete CV");
      }
    } catch (error) {
      toast.error("Failed to delete CV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleCloseAIResultModal = () => {
    setAiResultModalOpen(false);
    setAiScreenResult(null);
  };

  const getStatusTag = (status) => {
    if (!status) {
      status = "pending";
    }

    const statusConfig = {
      pending: { color: "orange", icon: <ClockCircleOutlined /> },
      approved: { color: "green", icon: <CheckCircleOutlined /> },
      rejected: { color: "red", icon: <CloseCircleOutlined /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Tag color={config.color} icon={config.icon}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  const getStatusCount = (status) => {
    return candidates.filter((c) => c.candidateInfo?.status === status).length;
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: ["personalInfo", "fullName"],
      width: 200,
      key: "fullName",
      sorter: (a, b) =>
        (a.personalInfo?.fullName || "").localeCompare(
          b.personalInfo?.fullName || "",
        ),
    },
    {
      title: "Email",
      dataIndex: ["personalInfo", "email"],
      key: "email",
      render: (email) => email || "-",
    },
    {
      title: "Phone",
      dataIndex: ["personalInfo", "phone"],
      key: "phone",
      render: (phone) => phone || "-",
    },
    {
      title: "Status",
      dataIndex: ["candidateInfo", "status"],
      key: "status",
      render: (status) => getStatusTag(status || "pending"),
    },
    {
      title: "",
      key: "actions",
      width: 320,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewCV(record)}
          >
            View CV
          </Button>

          <Button
            type="default"
            icon={<RobotOutlined />}
            size="small"
            onClick={() => handleAIScreen(record)}
            disabled={
              !record.candidateInfo?.cvUrl ||
              record.candidateInfo?.status !== "pending" ||
              aiScreenLoading
            }
            style={{
              background: "linear-gradient(135deg, #1e90ff 0%, #00d4ff 100%)",
              color: "white",
              border: "none",
            }}
          >
            AI Screen
          </Button>

          <Select
            value={record.candidateInfo?.status || "pending"}
            style={{ width: 110 }}
            onChange={(value) => handleStatusChange(record._id, value)}
            size="small"
            disabled={loading}
          >
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>

          <Popconfirm
            title="Delete CV"
            description={
              <div>
                <p>Are you sure you want to delete this CV?</p>
                <p style={{ color: "#ff4d4f", marginTop: 8 }}>
                  You can only delete a rejected CV.
                </p>
              </div>
            }
            onConfirm={() => handleDeleteCV(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: loading,
            }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={!record.candidateInfo?.cvUrl || loading}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="candidate-cv-management">
      {/* Loading Overlay */}
      {aiScreenLoading && (
        <div className="ai-loading-overlay">
          <Spin size="large" />
          <div className="ai-loading-text">
            <h3>AI is analyzing CV...</h3>
            <p>This may take a few moments</p>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Candidate CV Management</h1>
        <p className="page-subtitle">
          Review and manage candidate applications with AI screening
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <Card
          className={`stat-card ${statusFilter === "all" ? "active" : ""}`}
          hoverable
          onClick={() => setStatusFilter("all")}
        >
          <div className="stat-icon all">
            <TeamOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{candidates.length}</div>
            <div className="stat-label">Total Candidates</div>
          </div>
        </Card>

        <Card
          className={`stat-card ${statusFilter === "pending" ? "active" : ""}`}
          hoverable
          onClick={() => setStatusFilter("pending")}
        >
          <div className="stat-icon pending">
            <ClockCircleOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{getStatusCount("pending")}</div>
            <div className="stat-label">Pending</div>
          </div>
        </Card>

        <Card
          className={`stat-card ${statusFilter === "approved" ? "active" : ""}`}
          hoverable
          onClick={() => setStatusFilter("approved")}
        >
          <div className="stat-icon approved">
            <CheckCircleOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{getStatusCount("approved")}</div>
            <div className="stat-label">Approved</div>
          </div>
        </Card>

        <Card
          className={`stat-card ${statusFilter === "rejected" ? "active" : ""}`}
          hoverable
          onClick={() => setStatusFilter("rejected")}
        >
          <div className="stat-icon rejected">
            <CloseCircleOutlined />
          </div>
          <div className="stat-content">
            <div className="stat-value">{getStatusCount("rejected")}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} candidates`,
          }}
          locale={{ emptyText: "No candidates found" }}
        />
      </Card>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal
        visible={viewModalOpen}
        candidate={selectedCandidate}
        onClose={handleCloseModal}
      />

      {/* AI Screen Result Modal */}
      <AIScreenResultModal
        visible={aiResultModalOpen}
        result={aiScreenResult}
        onClose={handleCloseAIResultModal}
      />
    </div>
  );
};

export default CandidateCVManagement;
