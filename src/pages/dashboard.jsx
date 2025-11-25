import { Row, Col } from "antd";
import {
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SlidersOutlined,
  AuditOutlined,
  ProjectOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import DashboardCard from "../components/DashboardCard";
import viLocale from "@fullcalendar/core/locales/vi";

const Dashboard = () => {
  return (
    <div className="dashboard" style={{ padding: "24px" }}>
      {/* Quick Stats Row */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={
              <FileTextOutlined style={{ fontSize: 20, color: "#1890ff" }} />
            }
            title="Hóa đơn đang chờ thanh toán"
            value="0/0"
            options={{ progressColor: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={
              <ProjectOutlined style={{ fontSize: 20, color: "#52c41a" }} />
            }
            title="Mục tiêu đã hoàn thành"
            value="0/0"
            options={{ progressColor: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={
              <SlidersOutlined style={{ fontSize: 20, color: "#faad14" }} />
            }
            title="Các dự án Đang thực hiện"
            value="0/0"
            options={{ progressColor: "#faad14" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={<AuditOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />}
            title="Phân công chưa hoàn thành"
            value="0/0"
            height={120}
          />
        </Col>
      </Row>

      {/* Overview Section */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={24}>
          <DashboardCard
            type="progress-group"
            data={[
              {
                title: "Tổng quan hóa đơn",
                icon: <DollarCircleOutlined />,
                iconColor: "#faad14",
                items: [
                  { label: "Nháp", value: 0, total: 10, color: "#999" },
                  { label: "Chưa gửi", value: 0, total: 10, color: "#999" },
                  {
                    label: "Chưa thanh toán",
                    value: 0,
                    total: 10,
                    color: "#ff4d4f",
                  },
                  {
                    label: "Đã thanh toán một phần",
                    value: 0,
                    total: 10,
                    color: "#faad14",
                  },
                  { label: "Quá hạn", value: 0, total: 10, color: "#faad14" },
                  {
                    label: "Đã thanh toán",
                    value: 0,
                    total: 10,
                    color: "#52c41a",
                  },
                ],
              },
              {
                title: "Tổng quan báo giá",
                icon: <FileTextOutlined />,
                iconColor: "#1890ff",
                items: [
                  { label: "Nháp", value: 0, total: 10, color: "#999" },
                  { label: "Chưa gửi", value: 0, total: 10, color: "#999" },
                  { label: "Đã gửi", value: 0, total: 10, color: "#1890ff" },
                  { label: "Hết hạn", value: 0, total: 10, color: "#faad14" },
                  { label: "Từ chối", value: 0, total: 10, color: "#ff4d4f" },
                  { label: "Chấp nhận", value: 0, total: 10, color: "#52c41a" },
                ],
              },
              {
                title: "Tổng quan đề xuất dự án",
                icon: <ProjectOutlined />,
                iconColor: "#722ed1",
                items: [
                  { label: "Nháp", value: 0, total: 10, color: "#999" },
                  { label: "Đã gửi", value: 0, total: 10, color: "#1890ff" },
                  { label: "Đang mở", value: 0, total: 10, color: "#999" },
                  {
                    label: "Đã sửa đổi",
                    value: 0,
                    total: 10,
                    color: "#1890ff",
                  },
                  {
                    label: "Đã từ chối",
                    value: 0,
                    total: 10,
                    color: "#ff4d4f",
                  },
                  {
                    label: "Đã chấp thuận",
                    value: 0,
                    total: 10,
                    color: "#52c41a",
                  },
                ],
              },
            ]}
            footerItems={[
              { label: "Hóa đơn nổi bật", value: "$0.00", color: "#faad14" },
              { label: "Hóa đơn quá hạn", value: "$0.00", color: "#999" },
              {
                label: "Hóa đơn đã thanh toán",
                value: "$0.00",
                color: "#52c41a",
              },
            ]}
          />
        </Col>
      </Row>

      {/* Task List and Statistics */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <DashboardCard
            type="task"
            title="Nhắc nhở công việc của tôi"
            extra={
              <div>
                <a href="#">Xem tất cả</a> | <a href="#">Nhắc việc mới</a>
              </div>
            }
            data={[
              {
                icon: (
                  <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                ),
                title: "Nhắc việc gần đây",
                items: ["Không có ghi chú nhắc việc"],
                color: "#faad14",
                status: "pending",
              },
              {
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                title: "Việc vừa hoàn thành",
                items: ["Không tìm thấy việc đã hoàn thành"],
                color: "#52c41a",
                status: "done",
              },
            ]}
          />
        </Col>
        <Col xs={24} lg={8}>
          <DashboardCard
            type="pie"
            title="Thống kê theo trạng thái dự án"
            data={[
              { name: "Đang chờ", value: 0, color: "#faad14" },
              { name: "Đang thực hiện", value: 0, color: "#1890ff" },
              { name: "Hoàn thành", value: 0, color: "#52c41a" },
              { name: "Tạm dừng", value: 0, color: "#ff4d4f" },
            ]}
            options={{
              dataKey: "value",
              label: true,
            }}
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <DashboardCard
            type="calendar"
            title="Lịch công việc"
            height={530}
            options={{
              calendarProps: {
                events: [
                  {
                    title: "Bắt đầu dự án",
                    date: "2025-11-04",
                    color: "#1890ff",
                  },
                  {
                    title: "Họp khách hàng",
                    date: "2025-11-06",
                    color: "#52c41a",
                  },
                ],
                initialView: "dayGridMonth",
                locale: viLocale,
                selectable: true,
                onDateClick: (info) => console.log("Click ngày:", info.dateStr),
                onEventClick: (info) =>
                  console.log("Click sự kiện:", info.event.title),
              },
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
