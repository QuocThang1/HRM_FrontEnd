import { useState, useEffect } from "react";
import { Table, Button, Tag, Select, Space, Card, } from "antd";
import {
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllCandidatesApi, updateCandidateStatusApi } from "../../utils/Api/candidateApi";
import CandidateDetailModal from "./candidateDetailModal";
import "../../styles/candidateCVManagement.css";

const { Option } = Select;

const CandidateCVManagement = () => {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, []);

    useEffect(() => {
        filterCandidates();
    }, [statusFilter, candidates]);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const res = await getAllCandidatesApi();
            setCandidates(res.data);
            setFilteredCandidates(res.data);
        } catch (error) {
            toast.error("Failed to fetch candidates. Please try again.", { duration: 2000 });
            setCandidates([]);
            setFilteredCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    const filterCandidates = () => {
        if (statusFilter === "all") {
            setFilteredCandidates(candidates);
        } else {
            const filtered = candidates.filter(
                (c) => c.candidateInfo?.status === statusFilter
            );
            setFilteredCandidates(filtered);
        }
    };

    const handleStatusChange = async (candidateId, newStatus) => {
        try {
            setLoading(true);
            const res = await updateCandidateStatusApi(candidateId, newStatus);

            if (res && res.EC === 0) {
                toast.success(res.EM, { duration: 2000 });

                const updatedCandidates = candidates.map((c) =>
                    c._id === candidateId
                        ? {
                            ...c,
                            candidateInfo: { ...c.candidateInfo, status: newStatus },
                        }
                        : c
                );
                setCandidates(updatedCandidates);
            } else {
                toast.error(res.EM || "Failed to update candidate status", { duration: 2000 });
            }
        } catch (error) {
            toast.error("An error occurred while updating status. Please try again.", { duration: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleViewCV = (candidate) => {
        setSelectedCandidate(candidate);
        setViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setViewModalOpen(false);
        setSelectedCandidate(null);
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
            key: "fullName",
            sorter: (a, b) =>
                (a.personalInfo?.fullName || "").localeCompare(
                    b.personalInfo?.fullName || ""
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
            title: "Gender",
            dataIndex: ["personalInfo", "gender"],
            key: "gender",
            render: (gender) =>
                gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "-",
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
                    <Select
                        value={record.candidateInfo?.status || "pending"}
                        style={{ width: 120 }}
                        onChange={(value) => handleStatusChange(record._id, value)}
                        size="small"
                    >
                        <Option value="pending">Pending</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                </Space>
            ),
        },
    ];

    return (
        <div className="candidate-cv-management">
            <div className="page-header">
                <h1 className="page-title">Candidate CV Management</h1>
                <p className="page-subtitle">Review and manage candidate applications</p>
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
                        pageSize: 4,
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
        </div>
    );
};

export default CandidateCVManagement;