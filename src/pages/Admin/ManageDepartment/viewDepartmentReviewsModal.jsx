import { useEffect, useState } from "react";
import { Modal, Table, DatePicker, Spin } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getDepartmentReviewsApi } from "../../../utils/Api/departmentApi";

const { MonthPicker } = DatePicker;

const ViewDepartmentReviewsModal = ({ open, onClose, departmentId }) => {
    const [reviews, setReviews] = useState([]);
    const [month, setMonth] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchReviews();
        } else {
            setReviews([]);
            setMonth(null);
        }
        // eslint-disable-next-line
    }, [open, departmentId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await getDepartmentReviewsApi(departmentId);
            setReviews(res.data);
        } catch (err) {
            toast.error("Failed to load reviews");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = reviews.filter((r) => {
        if (!month) return true;
        return dayjs(r.month).format("YYYY-MM") === dayjs(month).format("YYYY-MM");
    });

    const columns = [
        {
            title: "Month",
            dataIndex: "month",
            render: (m) => (m ? dayjs(m).format("YYYY-MM") : "-"),
        },
        {
            title: "Score",
            dataIndex: "score",
        },
        {
            title: "Comments",
            dataIndex: "comments",
            ellipsis: true,
        },
        {
            title: "Admin",
            dataIndex: "adminId",
            render: (a) => a?.personalInfo.fullName,
        },
    ];

    return (
        <Modal
            title="Department Reviews"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <MonthPicker
                    placeholder="Filter by month"
                    onChange={(v) => setMonth(v ? v : null)}
                    value={month}
                />
                <a onClick={fetchReviews} style={{ cursor: "pointer" }}>Reload</a>
                <div style={{ flex: 1 }} />
                <Spin spinning={loading} />
            </div>

            <Table
                dataSource={filtered}
                columns={columns}
                rowKey={(r) => r._id || `${r.departmentId}-${r.month}`}
                pagination={{ pageSize: 6 }}
                locale={{ emptyText: "No reviews" }}
            />
        </Modal>
    );
};

export default ViewDepartmentReviewsModal;