import { useState, useEffect, useMemo } from "react";
import { Card, Select, Typography, Space, Spin, Alert } from "antd";
import {
    BarChartOutlined,
    CalendarOutlined,
    TrophyOutlined,
    StarOutlined,
    LineChartOutlined,
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
import {
    getManagerDepartmentApi,
    getDepartmentReviewsApi,
} from "../../../utils/Api/departmentApi";
import dayjs from "dayjs";
import "../../../styles/reviewStatistics.css";

const { Title, Text } = Typography;
const { Option } = Select;

const ReviewStatistics = () => {
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [department, setDepartment] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deptLoading, setDeptLoading] = useState(false);

    const fetchDepartment = async () => {
        try {
            setDeptLoading(true);
            const res = await getManagerDepartmentApi();
            if (res && res.data) {
                setDepartment(res.data);
            }
        } catch (error) {
            console.error("Error fetching department:", error);
        } finally {
            setDeptLoading(false);
        }
    };

    const fetchReviews = async () => {
        if (!department?._id) return;

        try {
            setLoading(true);
            const res = await getDepartmentReviewsApi(department._id);
            if (res && res.data) {
                setReviews(res.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartment();
    }, []);

    useEffect(() => {
        if (department?._id) {
            fetchReviews();
        }
    }, [department?._id]);

    const yearOptions = useMemo(() => {
        const yearsSet = new Set();
        reviews.forEach((review) => {
            if (review.month) {
                const [year] = review.month.split("-");
                yearsSet.add(parseInt(year));
            }
        });
        const years = Array.from(yearsSet).sort((a, b) => b - a);

        if (years.length === 0) {
            years.push(dayjs().year());
        }

        return years;
    }, [reviews]);

    const chartData = useMemo(() => {
        const monthlyData = {};

        for (let i = 1; i <= 12; i++) {
            const monthKey = `${selectedYear}-${i.toString().padStart(2, "0")}`;
            monthlyData[monthKey] = {
                month: i,
                score: 0,
                count: 0,
            };
        }

        reviews.forEach((review) => {
            if (review.month && review.month.startsWith(`${selectedYear}-`)) {
                if (monthlyData[review.month]) {
                    monthlyData[review.month].score += review.score || 0;
                    monthlyData[review.month].count += 1;
                }
            }
        });

        return Object.values(monthlyData).map((data) => ({
            month: `T${data.month}`,
            score: data.count > 0 ? (data.score / data.count).toFixed(1) : 0,
            rawScore: data.count > 0 ? data.score / data.count : 0,
        }));
    }, [reviews, selectedYear]);

    const stats = useMemo(() => {
        const yearReviews = reviews.filter((review) =>
            review.month?.startsWith(`${selectedYear}-`)
        );

        if (yearReviews.length === 0) {
            return {
                total: 0,
                average: 0,
                excellent: 0,
                good: 0,
                needImprovement: 0,
                highest: 0,
            };
        }

        const total = yearReviews.length;
        const sumScore = yearReviews.reduce(
            (sum, review) => sum + (review.score || 0),
            0
        );
        const average = sumScore / total;

        const excellent = yearReviews.filter((r) => r.score >= 8).length;
        const good = yearReviews.filter((r) => r.score >= 6 && r.score < 8).length;
        const needImprovement = yearReviews.filter((r) => r.score < 6).length;

        const highest = Math.max(...yearReviews.map((r) => r.score || 0));

        return {
            total,
            average: average.toFixed(1),
            excellent,
            good,
            needImprovement,
            highest: highest.toFixed(1),
        };
    }, [reviews, selectedYear]);

    const getBarColor = (score) => {
        const numScore = parseFloat(score);
        if (numScore >= 8) return "#52c41a";
        if (numScore >= 6) return "#1890ff";
        if (numScore >= 4) return "#faad14";
        return "#ff4d4f";
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const score = parseFloat(payload[0].value);
            let rating = "Poor";
            if (score >= 8) rating = "Excellent";
            else if (score >= 6) rating = "Good";
            else if (score >= 4) rating = "Average";

            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{payload[0].payload.month}</p>
                    <p className="tooltip-score">
                        Score: <strong>{payload[0].value}</strong> / 10
                    </p>
                    <p className="tooltip-rating" style={{ color: getBarColor(score) }}>
                        {rating}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (deptLoading) {
        return (
            <div className="review-statistics-page">
                <div className="loading-container">
                    <Spin size="large" tip="Loading department information..." />
                </div>
            </div>
        );
    }

    if (!department) {
        return (
            <div className="review-statistics-page">
                <Alert
                    message="No Department Assigned"
                    description="You are not assigned to any department as a manager."
                    type="warning"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="review-statistics-page">
            <div className="page-header">
                <Title level={2} className="page-title">
                    <BarChartOutlined /> Review Statistics
                </Title>
                <div className="page-subtitle">
                    Performance statistics for {department?.departmentName}
                </div>
            </div>

            <Card style={{ marginBottom: 24 }}>
                <Space size="large" align="center">
                    <Space direction="vertical" size={4}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>
                            <CalendarOutlined /> Select Year
                        </span>
                        <Select
                            value={selectedYear}
                            onChange={setSelectedYear}
                            style={{ width: 150 }}
                            size="large"
                        >
                            {yearOptions.map((year) => (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        Showing data for year {selectedYear}
                    </Text>
                </Space>
            </Card>

            <Spin spinning={loading} tip="Loading data...">
                <div className="stats-cards">
                    <Card className="stat-card">
                        <div className="stat-icon all">
                            <BarChartOutlined />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Reviews</div>
                        </div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon approved">
                            <StarOutlined />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.average}</div>
                            <div className="stat-label">Average Score</div>
                        </div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon pending">
                            <TrophyOutlined />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.excellent}</div>
                            <div className="stat-label">Excellent (8-10)</div>
                        </div>
                    </Card>

                    <Card className="stat-card">
                        <div className="stat-icon rejected">
                            <LineChartOutlined />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.highest}</div>
                            <div className="stat-label">Highest Score</div>
                        </div>
                    </Card>
                </div>

                <Card
                    title={
                        <Space>
                            <BarChartOutlined />
                            <span>Monthly Performance Overview - {selectedYear}</span>
                        </Space>
                    }
                    className="chart-card"
                >
                    <div className="chart-legend">
                        <Space size="large" wrap>
                            <Space>
                                <div className="legend-dot excellent"></div>
                                <Text>Excellent (8-10)</Text>
                            </Space>
                            <Space>
                                <div className="legend-dot good"></div>
                                <Text>Good (6-7.9)</Text>
                            </Space>
                            <Space>
                                <div className="legend-dot average"></div>
                                <Text>Average (4-5.9)</Text>
                            </Space>
                            <Space>
                                <div className="legend-dot poor"></div>
                                <Text>Poor (&lt;4)</Text>
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
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                                tick={{ fill: "#666", fontSize: 14 }}
                                axisLine={{ stroke: "#d9d9d9" }}
                                label={{
                                    value: "Score",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fill: "#666", fontWeight: 500 },
                                }}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                            />
                            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getBarColor(entry.score)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card
                    title={
                        <Space>
                            <LineChartOutlined /> Summary
                        </Space>
                    }
                    style={{ marginTop: 24 }}
                >
                    <div className="summary-grid">
                        <div className="summary-item">
                            <Text type="secondary">Total Reviews This Year</Text>
                            <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                                {stats.total}
                            </Title>
                        </div>
                        <div className="summary-item">
                            <Text type="secondary">Average Performance</Text>
                            <Title level={3} style={{ margin: 0, color: "#52c41a" }}>
                                {stats.average} / 10
                            </Title>
                        </div>
                        <div className="summary-item">
                            <Text type="secondary">Excellent Reviews</Text>
                            <Title level={3} style={{ margin: 0, color: "#722ed1" }}>
                                {stats.excellent}
                            </Title>
                        </div>
                        <div className="summary-item">
                            <Text type="secondary">Need Improvement</Text>
                            <Title level={3} style={{ margin: 0, color: "#ff4d4f" }}>
                                {stats.needImprovement}
                            </Title>
                        </div>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default ReviewStatistics;