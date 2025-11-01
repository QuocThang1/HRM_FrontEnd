import { Table, Button, Popconfirm, Card, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import {
    getAllShiftTypesApi,
    deleteShiftTypeApi,
} from "../../utils/Api/shiftTypeApi";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import AddShiftModal from "./addShiftModal";
import EditShiftModal from "./editShiftModal";
import { toast } from "react-toastify";
import "../../styles/listOfShift.css";

const ShiftManagementPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentShiftId, setCurrentShiftId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            setLoading(true);
            const res = await getAllShiftTypesApi();
            if (res && Array.isArray(res.data)) {
                setDataSource(res.data);
            } else {
                toast.error(res?.EM || "Failed to fetch shifts", {
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error("Error fetching shifts:", error);
            toast.error("Cannot fetch shifts from server", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setCurrentShiftId(record._id);
        setEditModalOpen(true);
    };

    const handleDelete = async (shiftId) => {
        try {
            setLoading(true);
            await deleteShiftTypeApi(shiftId);
            toast.success("Shift deleted successfully", { autoClose: 2000 });
            fetchShifts();
        } catch (error) {
            console.error("Error deleting shift:", error);
            toast.error("Failed to delete shift", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Shift Code",
            dataIndex: "shiftCode",
            key: "shiftCode",
            width: 150,
            render: (code) => (
                <div className="shift-code-cell">
                    <ClockCircleOutlined className="shift-icon" />
                    <span className="shift-code">{code}</span>
                </div>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 150,
            ellipsis: true,
            render: (description) => (
                <span className="description-text">
                    {description || "No description"}
                </span>
            ),
        },
        {
            title: "Time Range",
            key: "timeRange",
            width: 150,
            render: (_, record) => (
                <div className="time-range-cell">
                    <Tag color="blue">{record.fromTime}</Tag>
                    <span>→</span>
                    <Tag color="blue">{record.toTime}</Tag>
                </div>
            ),
        },
        {
            title: "Late Allowed",
            dataIndex: "allowedLateMinute",
            key: "allowedLateMinute",
            width: 120,
            align: "center",
            render: (minutes) => (
                <Tag color="orange">{minutes} min</Tag>
            ),
        },
        {
            title: "Early Leave",
            dataIndex: "allowedEarlyLeaveMinute",
            key: "allowedEarlyLeaveMinute",
            width: 120,
            align: "center",
            render: (minutes) => (
                <Tag color="orange">{minutes} min</Tag>
            ),
        },
        {
            title: "Type",
            dataIndex: "isOvertime",
            key: "isOvertime",
            width: 120,
            align: "center",
            render: (isOvertime) => (
                <Tag color={isOvertime === "overtime" ? "green" : "blue"}>
                    {isOvertime === "overtime" ? "OVERTIME" : "NORMAL"}
                </Tag>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 200,
            fixed: "right",
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                        className="action-button edit-button"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Shift"
                        description="Are you sure to delete this shift?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            className="action-button delete-button"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="shift-management-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Shift Management</h1>
                    <p className="page-subtitle">
                        Manage work shifts and schedules
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                    className="add-button"
                >
                    Add Shift
                </Button>
            </div>

            {/* Table */}
            <Card className="table-card">
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 8,
                        showTotal: (total) => `Total ${total} shifts`,
                        showSizeChanger: false,
                    }}
                    locale={{ emptyText: "No shifts found" }}
                    className="shift-table"
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Modals */}
            <AddShiftModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchShifts}
            />

            <EditShiftModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                shiftId={currentShiftId}
                onSuccess={fetchShifts}
            />
        </div>
    );
};

export default ShiftManagementPage;