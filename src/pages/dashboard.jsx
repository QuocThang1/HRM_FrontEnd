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
            title="Invoices pending payment"
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
            title="Goal accomplished"
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
            title="Ongoing Projects"
            value="0/0"
            options={{ progressColor: "#faad14" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <DashboardCard
            type="statCard"
            icon={<AuditOutlined style={{ fontSize: 20, color: "#ff4d4f" }} />}
            title="Incomplete assignment"
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
                title: "Invoice Overview",
                icon: <DollarCircleOutlined />,
                iconColor: "#faad14",
                items: [
                  { label: "Draft", value: 0, total: 10, color: "#999" },
                  { label: "Not Sent", value: 0, total: 10, color: "#999" },
                  {
                    label: "Unpaid",
                    value: 0,
                    total: 10,
                    color: "#ff4d4f",
                  },
                  {
                    label: "Partially Paid",
                    value: 0,
                    total: 10,
                    color: "#faad14",
                  },
                  { label: "Overdue", value: 0, total: 10, color: "#faad14" },
                  {
                    label: "Paid",
                    value: 0,
                    total: 10,
                    color: "#52c41a",
                  },
                ],
              },
              {
                title: "Quote Overview",
                icon: <FileTextOutlined />,
                iconColor: "#1890ff",
                items: [
                  { label: "Draft", value: 0, total: 10, color: "#999" },
                  { label: "Not Sent", value: 0, total: 10, color: "#999" },
                  { label: "Sent", value: 0, total: 10, color: "#1890ff" },
                  { label: "Expired", value: 0, total: 10, color: "#faad14" },
                  { label: "Rejected", value: 0, total: 10, color: "#ff4d4f" },
                  { label: "Accepted", value: 0, total: 10, color: "#52c41a" },
                ],
              },
              {
                title: "Project Proposal Overview",
                icon: <ProjectOutlined />,
                iconColor: "#722ed1",
                items: [
                  { label: "Draft", value: 0, total: 10, color: "#999" },
                  { label: "Sent", value: 0, total: 10, color: "#1890ff" },
                  { label: "Open", value: 0, total: 10, color: "#999" },
                  {
                    label: "Revised",
                    value: 0,
                    total: 10,
                    color: "#1890ff",
                  },
                  {
                    label: "Rejected",
                    value: 0,
                    total: 10,
                    color: "#ff4d4f",
                  },
                  {
                    label: "Approved",
                    value: 0,
                    total: 10,
                    color: "#52c41a",
                  },
                ],
              },
            ]}
            footerItems={[
              {
                label: "Outstanding Invoice",
                value: "$0.00",
                color: "#faad14",
              },
              { label: "Overdue Invoice", value: "$0.00", color: "#999" },
              {
                label: "Paid Invoice",
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
            title="My Task Reminders"
            extra={
              <div>
                <a href="#">View All</a> | <a href="#">New Reminder</a>
              </div>
            }
            data={[
              {
                icon: (
                  <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                ),
                title: "Recent Reminders",
                items: ["No reminder notes available"],
                color: "#faad14",
                status: "pending",
              },
              {
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                title: "Recently Completed Tasks",
                items: ["No completed tasks found"],
                color: "#52c41a",
                status: "done",
              },
            ]}
          />
        </Col>

        <Col xs={24} lg={8}>
          <DashboardCard
            type="pie"
            title="Project Status Statistics"
            data={[
              { name: "Pending", value: 0, color: "#faad14" },
              { name: "In Progress", value: 0, color: "#1890ff" },
              { name: "Completed", value: 0, color: "#52c41a" },
              { name: "Paused", value: 0, color: "#ff4d4f" },
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
            title="Work Calendar"
            height={530}
            options={{
              calendarProps: {
                events: [
                  {
                    title: "Project Kickoff",
                    date: "2025-11-04",
                    color: "#1890ff",
                  },
                  {
                    title: "Client Meeting",
                    date: "2025-11-06",
                    color: "#52c41a",
                  },
                ],
                initialView: "dayGridMonth",
                locale: viLocale, // If you want English, replace this with enLocale
                selectable: true,
                onDateClick: (info) =>
                  console.log("Date clicked:", info.dateStr),
                onEventClick: (info) =>
                  console.log("Event clicked:", info.event.title),
              },
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
