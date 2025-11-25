import { useState, useEffect } from "react";
import { Table, Card, Tag, Typography } from "antd";
import {
    FileTextOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import { getMyContractsApi } from "../../../utils/Api/contractApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../../../styles/listContract.css";

const { Title } = Typography;

const ListContract = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const res = await getMyContractsApi();

            if (res && res.EC === 0) {
                let contractsData = [];

                if (res.data) {
                    if (typeof res.data === 'object' && !Array.isArray(res.data)) {
                        contractsData = [res.data];
                    }
                    else if (Array.isArray(res.data)) {
                        contractsData = res.data;
                    }
                }

                setContracts(contractsData);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Cannot fetch contracts from server", {
                autoClose: 2000,
            });
            setContracts([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "success";
            case "expired":
                return "error";
            default:
                return "default";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "active":
                return <CheckCircleOutlined />;
            case "expired":
                return <CloseCircleOutlined />;
            default:
                return null;
        }
    };

    const handleRowClick = (contractId) => {
        navigate(`/profile/contract/${contractId}`);
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
            title: "Staff Name",
            dataIndex: ["staffId", "personalInfo", "fullName"],
            width: 200,
            render: (text) => <strong>{text || "N/A"}</strong>,
        },
        {
            title: "Contract Period",
            key: "period",
            width: 250,
            render: (record) => (
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        {record.fromDate ? dayjs(record.fromDate).format("DD/MM/YYYY") : "N/A"} -{" "}
                        {record.toDate ? dayjs(record.toDate).format("DD/MM/YYYY") : "N/A"}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                        Duration:{" "}
                        {record.fromDate && record.toDate
                            ? dayjs(record.toDate).diff(dayjs(record.fromDate), "month")
                            : 0}{" "}
                        months
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 120,
            align: "center",
            render: (status) => (
                <Tag
                    color={getStatusColor(status)}
                    icon={getStatusIcon(status)}
                    style={{ fontSize: 13, padding: "4px 12px" }}
                >
                    {status?.toUpperCase() || "N/A"}
                </Tag>
            ),
        },
        {
            title: "Created By",
            dataIndex: ["createdBy", "personalInfo", "fullName"],
            width: 180,
            render: (text) => text || "N/A",
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            width: 150,
            align: "center",
            render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
        },
    ];

    // Filter contracts by status
    const filteredContracts =
        selectedStatus === "all"
            ? contracts
            : contracts.filter((c) => c.status === selectedStatus);

    console.log("Filtered Contracts:", filteredContracts);

    // Calculate stats
    const stats = {
        all: contracts.length,
        active: contracts.filter((c) => c.status === "active").length,
        expired: contracts.filter((c) => c.status === "expired").length,
    };

    console.log("Stats:", stats);

    return (
        <div className="list-contract-page">
            {/* Page Header */}
            <div className="page-header">
                <Title level={2} className="page-title">
                    <FileTextOutlined /> My Contracts
                </Title>
                <div className="page-subtitle">
                    View and manage your employment contracts
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
                <Card
                    className={`stat-card ${selectedStatus === "all" ? "active" : ""}`}
                    onClick={() => setSelectedStatus("all")}
                >
                    <div className="stat-icon all">
                        <FileTextOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.all}</div>
                        <div className="stat-label">Total Contracts</div>
                    </div>
                </Card>

                <Card
                    className={`stat-card ${selectedStatus === "active" ? "active" : ""}`}
                    onClick={() => setSelectedStatus("active")}
                >
                    <div className="stat-icon approved">
                        <CheckCircleOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.active}</div>
                        <div className="stat-label">Active Contracts</div>
                    </div>
                </Card>

                <Card
                    className={`stat-card ${selectedStatus === "expired" ? "active" : ""}`}
                    onClick={() => setSelectedStatus("expired")}
                >
                    <div className="stat-icon rejected">
                        <CloseCircleOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.expired}</div>
                        <div className="stat-label">Expired Contracts</div>
                    </div>
                </Card>
            </div>

            {/* Contracts Table */}
            <Card className="contracts-table-card">
                <div className="table-header">
                    <h3 className="table-title">
                        <FileTextOutlined />
                        {selectedStatus === "all"
                            ? "All Contracts"
                            : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Contracts`}
                    </h3>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredContracts}
                    loading={loading}
                    rowKey="_id"
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record._id),
                        style: { cursor: "pointer" },
                    })}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} contracts`,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    locale={{
                        emptyText: (
                            <div className="empty-state">
                                <InboxOutlined className="empty-icon" />
                                <div className="empty-title">No Contracts Found</div>
                                <div className="empty-description">
                                    {selectedStatus === "all"
                                        ? "You don't have any contracts yet"
                                        : `No ${selectedStatus} contracts found`}
                                </div>
                            </div>
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default ListContract;