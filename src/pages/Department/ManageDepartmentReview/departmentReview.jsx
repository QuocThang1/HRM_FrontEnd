import { useEffect, useState } from "react";
import {
    Table,
    Button,
    DatePicker,
    Popconfirm,
    Spin,
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    getDepartmentReviewsByAdminApi,
    deleteDepartmentReviewApi,
} from "../../../utils/Api/departmentApi";
import EditDepartmentReviewModal from "./editDepartmentReviewModal";
import { useSearchParams } from "react-router-dom";

const { MonthPicker } = DatePicker;

const ManageDepartmentReview = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialMonth = searchParams.get("month") ? dayjs(searchParams.get("month"), "YYYY-MM") : null;
    const [month, setMonth] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (initialMonth) setMonth(initialMonth);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        loadReviews();
        // eslint-disable-next-line
    }, [month]);

    const loadReviews = async () => {
        setFetching(true);
        try {
            const monthParam = month ? dayjs(month).format("YYYY-MM") : null;
            const res = await getDepartmentReviewsByAdminApi(monthParam);
            setReviews(res.data);
        } catch (err) {
            toast.error("Failed to fetch reviews", { autoClose: 2000 });
            setReviews([]);
        } finally {
            setFetching(false);
        }
    };

    const openEdit = (record) => {
        setEditing(record);
        setEditModalOpen(true);
    };

    const handleDelete = async (reviewId) => {
        try {
            setLoading(true);
            const res = await deleteDepartmentReviewApi(reviewId);
            if (res && res.EC === 0) {
                toast.success(res.EM, { autoClose: 2000 });
                loadReviews();
            } else {
                toast.error("Delete failed", { autoClose: 2000 });
            }
        } catch (err) {
            toast.error("Failed to delete review", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Month",
            dataIndex: "month",
            render: (m) => (m ? dayjs(m).format("YYYY-MM") : "-"),
        },
        {
            title: "Department",
            dataIndex: "departmentId",
            render: (d) => d?.departmentName || d?.name || "-",
        },
        { title: "Score", dataIndex: "score" },
        { title: "Comments", dataIndex: "comments", ellipsis: true },
        {
            title: "",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <Button
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(record);
                        }}
                    />
                    <Popconfirm
                        title="Delete this review?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Popconfirm>
                </div>
            ),
            onCell: () => ({ onClick: (e) => e.stopPropagation() }),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <MonthPicker
                    placeholder="Select month"
                    onChange={(v) => {
                        const newMonth = v ? v : null;
                        setMonth(newMonth);
                        if (newMonth) {
                            setSearchParams({ month: dayjs(newMonth).format("YYYY-MM") });
                        } else {
                            setSearchParams({});
                        }
                    }}
                    value={month}
                />
                <Button onClick={loadReviews}>Reload</Button>
                <div style={{ flex: 1 }} />
                <Spin spinning={fetching || loading} />
            </div>

            <Table
                dataSource={reviews}
                columns={columns}
                rowKey={(r) => r._id}
                pagination={{ pageSize: 6 }}
                locale={{ emptyText: "No reviews" }}
            />

            <EditDepartmentReviewModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditing(null);
                }}
                review={editing}
                onSuccess={() => {
                    setEditModalOpen(false);
                    setEditing(null);
                    loadReviews();
                }}
            />
        </div>
    );
};

export default ManageDepartmentReview;