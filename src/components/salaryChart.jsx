import { Card, Select, Space, Typography } from "antd";
import {
    BarChartOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

const SalaryChart = ({ monthlySalaries, selectedYear, onYearChange }) => {
    const getYearOptions = () => {
        const yearsSet = new Set();
        monthlySalaries.forEach((salary) => {
            if (salary.year) {
                yearsSet.add(salary.year);
            }
        });
        const years = Array.from(yearsSet).sort((a, b) => b - a);

        if (years.length === 0) {
            years.push(dayjs().year());
        }

        return years;
    };

    const getChartData = () => {
        const monthlyData = {};

        // Khởi tạo 12 tháng
        for (let i = 1; i <= 12; i++) {
            monthlyData[i] = {
                month: i,
                salary: 0,
            };
        }

        // Populate data cho năm được chọn
        monthlySalaries.forEach((salary) => {
            if (salary.year === selectedYear && salary.month) {
                monthlyData[salary.month] = {
                    month: salary.month,
                    salary: salary.totalSalary || 0,
                };
            }
        });

        const chartData = Object.values(monthlyData).map((data) => ({
            month: `T${data.month}`,
            salary: data.salary,
        }));

        return chartData;
    };

    const chartData = getChartData();

    const getBarColor = (salary) => {
        if (salary === 0) return "#d9d9d9"; // Xám - chưa có data
        if (salary >= 3000) return "#52c41a"; // Xanh lá - cao
        if (salary >= 2000) return "#1890ff"; // Xanh dương - trung bình
        if (salary >= 1000) return "#faad14"; // Vàng - thấp
        return "#ff4d4f"; // Đỏ - rất thấp
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const salary = payload[0].value;

            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{payload[0].payload.month}</p>
                    <p className="tooltip-score">
                        Salary: <strong>{formatCurrency(salary)}</strong>
                    </p>
                    {salary === 0 && (
                        <p className="tooltip-rating" style={{ color: "#999" }}>
                            No data
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {/* Year Filter */}
            <Card style={{ marginBottom: 24 }}>
                <Space size="large" align="center">
                    <Space direction="vertical" size={4}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>
                            <CalendarOutlined /> Select Year
                        </span>
                        <Select
                            value={selectedYear}
                            onChange={onYearChange}
                            style={{ width: 150 }}
                            size="large"
                        >
                            {getYearOptions().map((year) => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        Showing salary data for year {selectedYear}
                    </Text>
                </Space>
            </Card>

            {/* Chart */}
            <Card
                title={
                    <Space>
                        <BarChartOutlined />
                        <span>Monthly Salary Overview - {selectedYear}</span>
                    </Space>
                }
                className="chart-card"
            >
                <div className="chart-legend">
                    <Space size="large" wrap>
                        <Space>
                            <div className="legend-dot" style={{ background: "#52c41a" }}></div>
                            <Text>High (≥$3,000)</Text>
                        </Space>
                        <Space>
                            <div className="legend-dot" style={{ background: "#1890ff" }}></div>
                            <Text>Medium ($2,000-$2,999)</Text>
                        </Space>
                        <Space>
                            <div className="legend-dot" style={{ background: "#faad14" }}></div>
                            <Text>Low ($1,000-$1,999)</Text>
                        </Space>
                        <Space>
                            <div className="legend-dot" style={{ background: "#d9d9d9" }}></div>
                            <Text>No Data</Text>
                        </Space>
                    </Space>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#666", fontSize: 14 }}
                            axisLine={{ stroke: "#d9d9d9" }}
                        />
                        <YAxis
                            tick={{ fill: "#666", fontSize: 14 }}
                            axisLine={{ stroke: "#d9d9d9" }}
                            tickFormatter={formatCurrency}
                            label={{
                                value: "Salary (USD)",
                                angle: -90,
                                position: "insideLeft",
                                style: { fill: "#666", fontWeight: 500 },
                            }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        />
                        <Bar dataKey="salary" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getBarColor(entry.salary)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </>
    );
};

export default SalaryChart;