import { Card, Progress, Typography } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardCalendar from "./DashboardCalendar";
const { Title } = Typography;

const DashboardCard = ({
  title,
  type = "default",
  data = [],
  footerItems = [],
  icon,
  value,
  options = {},
  height = 300,
  width = "100%",
  className,
  extra,
  loading = false,
}) => {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={options.xAxis || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              {options.bars?.map((bar, index) => (
                <Bar
                  key={index}
                  dataKey={bar.dataKey}
                  fill={
                    bar.color ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  name={bar.name || bar.dataKey}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              {/* Tooltip vẫn giữ */}
              <Tooltip formatter={(value, name) => [`${value}`, name]} />

              {/* ✅ Legend luôn hiển thị, kể cả khi không có dữ liệu */}
              <Legend
                content={() => (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <div
                          key={`legend-${index}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "5px 10px",
                            fontSize: 13,
                          }}
                        >
                          <div
                            style={{
                              width: 14,
                              height: 14,
                              backgroundColor: item.color,
                              marginRight: 6,
                              borderRadius: 3,
                            }}
                          />
                          <span>{item.name}</span>
                        </div>
                      ))
                    ) : (
                      <Typography.Text type="secondary">
                        Không có dữ liệu
                      </Typography.Text>
                    )}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case "progress-group":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Nhóm progress boxes */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              {data.map((group, gIndex) => (
                <div
                  key={gIndex}
                  style={{
                    flex: "1 1 300px",
                    background: "#fff",
                    borderRadius: 8,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* ✅ Chỉ render header nếu có title hoặc icon */}
                  {(group.title || group.icon) && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 16,
                        paddingBottom: 8,
                      }}
                    >
                      {group.icon && (
                        <div style={{ fontSize: 18, color: "#555" }}>
                          {group.icon}
                        </div>
                      )}
                      {group.title && (
                        <Typography.Title
                          level={5}
                          style={{
                            margin: 0,
                            fontSize: 15,
                            color: "rgba(0,0,0,0.85)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {group.title}
                        </Typography.Title>
                      )}
                    </div>
                  )}

                  {/* Progress items */}
                  <div style={{ flex: 1 }}>
                    {group.items.map((item, index) => (
                      <div key={index} style={{ marginBottom: 12 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 13,
                            marginBottom: 4,
                          }}
                        >
                          <Typography.Text
                            style={{ color: item.color || "#000" }}
                          >
                            {item.label}
                          </Typography.Text>
                          <Typography.Text>
                            {item.total > 0
                              ? `${((item.value / item.total) * 100).toFixed(0)}%`
                              : "0%"}
                          </Typography.Text>
                        </div>
                        <Progress
                          percent={
                            item.total > 0 ? (item.value / item.total) * 100 : 0
                          }
                          strokeColor={item.color}
                          showInfo={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Footer chung cho tất cả nhóm */}
            {footerItems && footerItems.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 8,
                  paddingTop: 12,
                  justifyContent: "left",
                }}
              >
                {footerItems.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      flex: "1 1 150px",
                      textAlign: "left",
                      borderRadius: 6,
                      border: "1px solid #d9d9d9",
                      padding: "12px 12px",
                    }}
                  >
                    <Typography.Text
                      style={{
                        display: "block",
                        fontWeight: 500,
                        color: f.color || "#000",
                        marginBottom: 4,
                      }}
                    >
                      {f.label}
                    </Typography.Text>
                    <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
                      {f.value}
                    </Typography.Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "calendar":
        return (
          <div style={{ height: height, overflow: "auto" }}>
            <DashboardCalendar {...options?.calendarProps} />
          </div>
        );
      case "statCard": {
        let current, total;

        // Xử lý value là string hoặc number
        if (typeof value === 'string' && value.includes('/')) {
          [current, total] = value.split("/");
        } else {
          // Nếu value là số, hiển thị số đó, không cần progress bar
          current = value;
          total = value;
        }

        const percent = total > 0 ? (parseInt(current) / parseInt(total)) * 100 : 0;

        return (
          <Card
            bordered={false}
            style={{
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              width: "100%",
              minHeight: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Hàng trên: icon + title + value */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ fontSize: 16, marginRight: 10 }}>{icon}</div>
                <Typography.Text
                  style={{
                    fontSize: 14,
                    color: "rgba(0,0,0,0.85)",
                    fontWeight: 500,
                  }}
                >
                  {title}
                </Typography.Text>
              </div>

              <Typography.Text
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#000",
                }}
              >
                {current}/{total}
              </Typography.Text>
            </div>

            {/* Thanh tiến trình */}
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={options.progressColor || "#1890ff"}
              strokeWidth={8}
              style={{ margin: 0 }}
            />
          </Card>
        );
      }

      case "task":
        return (
          <div>
            {data.map((section, index) => (
              <div
                key={index}
                style={{
                  marginBottom: index < data.length - 1 ? 24 : 0,
                  padding: "16px",
                  background:
                    section.status === "pending" ? "#fffbe6" : "#f6ffed",
                  border: `1px solid ${section.status === "pending" ? "#ffe58f" : "#b7eb8f"}`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  {section.icon}
                  <Typography.Text
                    strong
                    style={{
                      marginLeft: 8,
                      color:
                        section.status === "pending" ? "#faad14" : "#52c41a",
                    }}
                  >
                    {section.title}
                  </Typography.Text>
                </div>
                {section.items.map((item, itemIndex) => (
                  <Typography.Text
                    key={itemIndex}
                    type="secondary"
                    style={{
                      display: "block",
                      marginBottom:
                        itemIndex < section.items.length - 1 ? 8 : 0,
                      paddingLeft: 28,
                    }}
                  >
                    {item}
                  </Typography.Text>
                ))}
              </div>
            ))}
          </div>
        );

      default:
        return options.children;
    }
  };

  // Nếu là statCard -> render trực tiếp (không dùng Antd Card)
  if (type === "statCard") {
    return renderChart();
  }

  // Các loại còn lại vẫn bọc Card
  return (
    <Card
      title={
        <Title level={5} style={{ margin: 0, fontSize: "16px" }}>
          {title}
        </Title>
      }
      loading={loading}
      className={`dashboard-card ${className || ""} ${type}-card`}
      extra={extra}
      style={{
        width: width,
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        border: "1px solid #f0f0f0",
        height: "auto",
        display: "flex",
        flexDirection: "column",
      }}
      bodyStyle={{
        padding: "12px",
        minHeight: 200,
      }}
    >
      {renderChart()}
    </Card>
  );
};

export default DashboardCard;
