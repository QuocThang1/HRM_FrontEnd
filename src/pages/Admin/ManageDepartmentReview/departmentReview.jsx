import { useEffect, useState } from "react";
import {
  Table,
  Button,
  DatePicker,
  Popconfirm,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  getDepartmentReviewsByAdminApi,
  deleteDepartmentReviewApi,
} from "../../../utils/Api/departmentApi";
import EditDepartmentReviewModal from "./editDepartmentReviewModal";
import { useSearchParams } from "react-router-dom";
import "../../../styles/departmentReview.css";

const { MonthPicker } = DatePicker;
const { Title } = Typography;

const ManageDepartmentReview = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMonth = searchParams.get("month")
    ? dayjs(searchParams.get("month"), "YYYY-MM")
    : null;
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

  const getScoreClass = (score) => {
    if (score >= 9) return "excellent";
    if (score >= 7) return "good";
    if (score >= 5) return "average";
    return "poor";
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      width: 120,
      align: "center",
      render: (m) => (
        <span className="month-cell">
          {m ? dayjs(m).format("MMM YYYY") : "-"}
        </span>
      ),
    },
    {
      title: "Department",
      dataIndex: "departmentId",
      width: 200,
      render: (d) => (
        <span className="department-tag">
          {d?.departmentName || d?.name || "-"}
        </span>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      width: 100,
      align: "center",
      render: (score) => (
        <div className={`score-badge ${getScoreClass(score)}`}>
          {score}
        </div>
      ),
    },
    {
      title: "Comments",
      dataIndex: "comments",
      ellipsis: true,
      render: (text) => <div className="comments-cell">{text || "-"}</div>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            className="action-btn edit-btn"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              openEdit(record);
            }}
          />
          <Popconfirm
            title="Delete Review"
            description="Are you sure you want to delete this review?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              className="action-btn delete-btn"
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
    <div className="department-review-page">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} className="page-title">
          <FileTextOutlined /> Department Reviews
        </Title>
        <div className="page-subtitle">
          Manage and track department performance reviews
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <MonthPicker
          placeholder="Select month to filter"
          onChange={(v) => {
            const newMonth = v ? v : null;
            setMonth(newMonth);
            if (newMonth) {
              setSearchParams({
                month: dayjs(newMonth).format("YYYY-MM"),
              });
            } else {
              setSearchParams({});
            }
          }}
          value={month}
          style={{ width: 200 }}
        />
        <Button
          className="reload-button"
          icon={<ReloadOutlined />}
          onClick={loadReviews}
        >
          Reload
        </Button>
        <div style={{ flex: 1 }} />
        {(fetching || loading) && (
          <div className="loading-overlay">
            <Spin />
          </div>
        )}
      </div>

      {/* Reviews Table */}
      <div className="reviews-table-card">
        <div className="table-header">
          <h3 className="table-title">
            <FileTextOutlined />
            Review Records
          </h3>
        </div>
        <Table
          dataSource={reviews}
          columns={columns}
          rowKey={(r) => r._id}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reviews`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{
            emptyText: (
              <div className="empty-state-wrapper">
                <InboxOutlined className="empty-icon" />
                <div className="empty-title">No Reviews Found</div>
                <div className="empty-description">
                  {month
                    ? "No reviews for the selected month"
                    : "No department reviews available"}
                </div>
              </div>
            ),
          }}
        />
      </div>

      {/* Edit Modal */}
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