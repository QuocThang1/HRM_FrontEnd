import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Button, Space, Span } from "antd";
import {
  DollarOutlined,
  RiseOutlined,
  SlidersOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  FileOutlined,
  FileSyncOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const localizer = momentLocalizer(moment);

// ---------------- Progress Bar Component ----------------
const ProgressBar = ({ progress, color }) => {
  return (
    <div
      style={{
        marginTop: 8,
        background: "#eee",
        borderRadius: "10px",
        height: "5px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          background: `${color || "#4caf50"}`,
          height: "100%",
          transition: "width 0.4s ease", // animation mượt
        }}
      />
    </div>
  );
};
// ---------------- Bar Chart ----------------
const BarChartWidget = ({
  data = [],
  xKey = "name",
  bars = [],
  height = 200,
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      {bars.map((bar, idx) => (
        <Bar
          key={idx}
          dataKey={bar.key}
          fill={bar.color || "#8884d8"}
          name={bar.label || bar.key} // tên hiển thị trong Legend
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

// ---------------- Calendar ----------------

const events = [
  {
    title: "Họp nhóm",
    start: new Date(2025, 8, 25, 14, 0),
    end: new Date(2025, 8, 25, 15, 0),
  },
  {
    title: "Nộp báo cáo",
    start: new Date(2025, 8, 26, 9, 0),
    end: new Date(2025, 8, 26, 10, 0),
  },
];

const CustomToolbar = ({ label, onNavigate, onView, view }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
    }}
  >
    {/* Nút điều hướng */}
    <Button.Group>
      <Button onClick={() => onNavigate("PREV")}>&lt;</Button>
      <Button onClick={() => onNavigate("TODAY")}>Hôm Nay</Button>
      <Button onClick={() => onNavigate("NEXT")}>&gt;</Button>
    </Button.Group>

    {/* Tiêu đề */}
    <Span style={{ fontWeight: "bold", fontSize: 18 }}>{label}</Span>

    {/* Chế độ view + lọc */}
    <Space>
      <Button.Group>
        <Button
          type={view === "month" ? "primary" : "default"}
          onClick={() => onView("month")}
        >
          Tháng
        </Button>
        <Button
          type={view === "week" ? "primary" : "default"}
          onClick={() => onView("week")}
        >
          Tuần
        </Button>
        <Button
          type={view === "day" ? "primary" : "default"}
          onClick={() => onView("day")}
        >
          Ngày
        </Button>
      </Button.Group>
    </Space>
  </div>
);

const CalendarWidget = () => (
  <div style={{ padding: "16px", background: "#fff", borderRadius: "8px" }}>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      defaultView="month"
      style={{ height: "70vh" }}
      components={{ toolbar: (props) => <CustomToolbar {...props} /> }}
    />
  </div>
);

// ---------------- Widget Style ----------------
const widgetStyle = {
  background: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  minWidth: 200,
};

// ---------------- Quick Stat Widget ----------------
const QuickStat = ({ icon, title, value, progress, color }) => (
  <Card style={widgetStyle} bordered={false}>
    {/* Icon + Text */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 14 }}>{title}</span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{value}</span>
      </div>
    </div>

    {/* Progress full width, cả icon + text */}
    {progress !== undefined && (
      <ProgressBar progress={progress} color={color} />
    )}
  </Card>
);
// ---------------- Buget Widget ----------------
const BugetWidget = ({ columns, invoiceItems }) => (
  <Card style={widgetStyle} bordered={false}>
    {/* Grid nhiều cột Budget */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        gap: 16,
      }}
    >
      {columns.map((col, colIdx) => (
        <div
          key={colIdx}
          style={{
            minHeight: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "8px 0",
          }}
        >
          {/* Header: Icon + Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {col.icon}
            <h4 style={{ margin: 0, fontSize: 14 }}>{col.title}</h4>
          </div>

          {/* List items */}
          <div style={{ flex: 1 }}>
            {col.items.map((item, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ minWidth: 20, color: item.color }}>
                    {item.count}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      marginLeft: 6,
                      color: item.color,
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ minWidth: 30, textAlign: "right" }}>
                    {item.percent}%
                  </span>
                </div>
                <ProgressBar progress={item.percent} color={item.color} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Invoice section dưới Budget */}
    {invoiceItems && invoiceItems.length > 0 && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${invoiceItems.length}, 1fr)`,
          gap: 16,
          marginTop: 16,
        }}
      >
        {invoiceItems.map((item, idx) => (
          <Card
            key={idx}
            bordered
            style={{
              borderRadius: 6,
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: item.color || "#333",
              }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1f2937" }}>
              {item.value}
            </div>
          </Card>
        ))}
      </div>
    )}
  </Card>
);

//----------------- Todo List Widget ----------------
const TodoListWidget = ({ sections = [] }) => (
  <Card style={widgetStyle} bordered={false}>
    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <span style={{ fontWeight: 600 }}>Nhắc nhở công việc của tôi</span>
      <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
        <a href="#">Xem tất cả</a>
        <a href="#">Nhắc việc mới</a>
      </div>
    </div>

    {/* Nội dung các section (todo + done) */}
    <div style={{ display: "grid", gap: 20 }}>
      {sections.map(({ icon, color, status, items }, idx) => (
        <div key={idx}>
          {/* Tiêu đề */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 600,
              color,
              marginBottom: 8,
            }}
          >
            {icon}
            {status === "todo" ? "Nhắc việc gần đây" : "Việc vừa hoàn thành"}
          </div>

          {/* Items */}
          <div style={{ fontSize: 14, color: "#888" }}>
            {items.length > 0
              ? items.map((t, i) => <div key={i}>{t}</div>)
              : status === "todo"
                ? "Không có ghi chú nhắc việc"
                : "Không tìm thấy việc đã hoàn thành"}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// ---------------- Home Page ----------------
const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "16px", // thêm khoảng trống cho đẹp
        boxSizing: "border-box", // để padding không phá layout
      }}
    >
      {/* 1. Thống kê nhanh */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <QuickStat
          icon={<DollarOutlined style={{ fontSize: 18 }} />}
          title="Hóa đơn đang chờ thanh toán"
          value="0 / 0"
          progress={65}
          color="#1890ff"
        />
        <QuickStat
          icon={<RiseOutlined style={{ fontSize: 18 }} />}
          title="Mục tiêu đã chuyển đổi"
          value="0 / 0"
          progress={65}
          color="#52c41a"
        />
        <QuickStat
          icon={<SlidersOutlined style={{ fontSize: 18 }} />}
          title="Các dự án Đang thực hiện"
          value="0 / 0"
          progress={65}
          color="#faad14"
        />
        <QuickStat
          icon={<FileDoneOutlined style={{ fontSize: 18 }} />}
          title="Phân công chưa hoàn thành"
          value="0 / 0"
          progress={65}
          color="#eb2f96"
        />
      </div>

      {/* 2. Tổng quan ngân sách */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <BugetWidget
          columns={[
            {
              icon: <FileTextOutlined style={{ fontSize: 18 }} />,
              title: "Tổng Quan Hóa đơn",
              items: [
                { count: 3, label: "Nháp", percent: 20, color: "#999" },
                { count: 2, label: "Chưa gửi", percent: 40, color: "#999" },
                {
                  count: 2,
                  label: "Chưa Thanh toán",
                  percent: 40,
                  color: "#FF6961",
                },
                {
                  count: 2,
                  label: "Đã thanh toán một phần",
                  percent: 40,
                  color: "#FFC067",
                },
                { count: 2, label: "Quá hạn", percent: 40, color: "#FFC067" },
                {
                  count: 2,
                  label: "Đã thanh toán",
                  percent: 40,
                  color: "#77DD77",
                },
              ],
            },
            {
              icon: <FileOutlined style={{ fontSize: 18 }} />,
              title: "Tổng Quan Báo giá",
              items: [
                { count: 3, label: "Nháp", percent: 20, color: "#999" },
                { count: 2, label: "Chưa gửi", percent: 40, color: "#999" },
                { count: 2, label: "Đã gửi", percent: 40, color: "#779ECB" },
                { count: 2, label: "Hết hạn", percent: 40, color: "#FFC067" },
                { count: 2, label: "Từ chối", percent: 40, color: "#FF6961" },
                { count: 2, label: "Chấp nhận", percent: 40, color: "#77DD77" },
              ],
            },
            {
              icon: <FileSyncOutlined style={{ fontSize: 18 }} />,
              title: "Tổng Quan Dự án",
              items: [
                { count: 3, label: "Nháp", percent: 20, color: "#999" },
                { count: 2, label: "Đã gửi", percent: 40, color: "#779ECB" },
                { count: 2, label: "Đang mở", percent: 40, color: "#999" },
                {
                  count: 2,
                  label: "Đã sửa đổi",
                  percent: 40,
                  color: "#779ECB",
                },
                {
                  count: 2,
                  label: "Đã từ chối",
                  percent: 40,
                  color: "#FF6961",
                },
                {
                  count: 2,
                  label: "Đã chấp thuận",
                  percent: 40,
                  color: "#77DD77",
                },
              ],
            },
          ]}
          invoiceItems={[
            { title: "Hóa đơn nổi bật", value: "$0.00", color: "#FFC067" },
            { title: "Hóa đơn quá hạn", value: "$0.00", color: "#999" },
            {
              title: "Hóa đơn đã thanh toán",
              value: "$0.00",
              color: "#77DD77",
            },
          ]}
        />
      </div>

      {/* 3. Tiện ích người dùng */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <TodoListWidget
          sections={[
            {
              icon: <ExclamationCircleOutlined />,
              items: ["Đi họp lúc 9h", "Hoàn thành báo cáo"],
              color: "#FFC067",
              status: "todo",
            },
            {
              icon: <CheckCircleOutlined />,
              items: ["Gửi mail khách hàng", "Đã bàn giao task"],
              color: "#77DD77",
              status: "done",
            },
          ]}
        />
      </div>

      {/* 4. Lịch */}
      <div style={widgetStyle}>
        <CalendarWidget />
      </div>

      {/* 5. Hồ sơ thanh toán */}
      <div style={widgetStyle}>
        <h3>Hồ sơ thanh toán</h3>
        <p>Hóa đơn chưa thanh toán: 3</p>
        <p>Hóa đơn đã thanh toán: 12</p>
      </div>

      {/* 6. Hợp đồng sắp hết hạn */}
      <div style={widgetStyle}>
        <h3>Hợp đồng sắp hết hạn</h3>
        <ul>
          <li>Hợp đồng A - 30/09/2025</li>
          <li>Hợp đồng B - 05/10/2025</li>
        </ul>
      </div>

      {/* 7. Báo cáo ticket nhân viên */}
      <div style={widgetStyle}>
        <h3>Báo cáo ticket nhân viên</h3>
        <p>Đang xử lý: 5</p>
        <p>Hoàn thành: 20</p>
      </div>

      {/* 8. Nhắc nhở công việc */}
      <div style={widgetStyle}>
        <h3>Nhắc nhở công việc của tôi</h3>
        <ul>
          <li>Gửi báo cáo dự án</li>
          <li>Họp khách hàng</li>
          <li>Cập nhật task trên Jira</li>
        </ul>
      </div>

      {/* 9. Khách tiềm năng */}
      <BarChartWidget
        data={[
          { name: "Tháng 1", DoanhThu: 4000, LoiNhuan: 2400 },
          { name: "Tháng 2", DoanhThu: 3000, LoiNhuan: 1398 },
          { name: "Tháng 3", DoanhThu: 2000, LoiNhuan: 9800 },
          { name: "Tháng 4", DoanhThu: 2780, LoiNhuan: 3908 },
        ]}
        xKey="name"
        bars={[
          { key: "DoanhThu", color: "#8884d8", label: "Doanh thu" },
          { key: "LoiNhuan", color: "#82ca9d", label: "Lợi nhuận" },
        ]}
      />

      {/* 11. Hoạt động dự án cuối cùng */}
      <div style={widgetStyle}>
        <h3>Hoạt động dự án cuối cùng</h3>
        <ul>
          <li>Task A đã hoàn thành</li>
          <li>Task B đang tiến hành</li>
          <li>Task C chưa bắt đầu</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
