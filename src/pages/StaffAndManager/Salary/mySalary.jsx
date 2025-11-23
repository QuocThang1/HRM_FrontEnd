import { useState, useEffect } from "react";
import {
    Card,
    Table,
    Typography,
    Space,
    Spin,
    Alert,
    Tag,
    Tooltip,
} from "antd";
import {
    DollarOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    RiseOutlined,
    FallOutlined,
    FileTextOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { getMyMonthlySalariesApi } from "../../../utils/Api/monthlySalaryApi";
import { getMySalaryApi } from "../../../utils/Api/salaryApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import SalaryChart from "../../../components/salaryChart.jsx";
import "../../../styles/mySalary.css";

const { Title, Text } = Typography;

const MySalary = () => {
    const [monthlySalaries, setMonthlySalaries] = useState([]);
    const [hourlyRate, setHourlyRate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(dayjs().year());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchMonthlySalaries(), fetchHourlyRate()]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthlySalaries = async () => {
        try {
            const res = await getMyMonthlySalariesApi();
            if (res?.EC === 0) {
                setMonthlySalaries(res.data || []);
            } else {
                setMonthlySalaries([]);
            }
        } catch (error) {
            console.error("Error fetching monthly salaries:", error);
            toast.error("Failed to load salary history", { autoClose: 2000 });
            setMonthlySalaries([]);
        }
    };

    const fetchHourlyRate = async () => {
        try {
            const res = await getMySalaryApi();
            if (res?.EC === 0 && res.data) {
                setHourlyRate(res.data.hourlyRate);
            } else {
                setHourlyRate(null);
            }
        } catch (error) {
            console.error("Error fetching hourly rate:", error);
            setHourlyRate(null);
        }
    };

    const getStatistics = () => {
        if (monthlySalaries.length === 0) {
            return {
                totalSalaries: 0,
                averageSalary: 0,
                highestSalary: 0,
                totalBonus: 0,
                totalDeduction: 0,
                currentMonthSalary: 0,
            };
        }

        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();

        const totalSalaries = monthlySalaries.reduce(
            (sum, salary) => sum + (salary.totalSalary || 0),
            0
        );

        const averageSalary = totalSalaries / monthlySalaries.length;

        const highestSalary = Math.max(
            ...monthlySalaries.map((s) => s.totalSalary || 0)
        );

        const totalBonus = monthlySalaries.reduce(
            (sum, salary) => sum + (salary.bonus || 0),
            0
        );

        const totalDeduction = monthlySalaries.reduce(
            (sum, salary) => sum + (salary.deduction || 0),
            0
        );

        const currentMonthData = monthlySalaries.find(
            (s) => s.month === currentMonth && s.year === currentYear
        );
        const currentMonthSalary = currentMonthData?.totalSalary || 0;

        return {
            totalSalaries,
            averageSalary,
            highestSalary,
            totalBonus,
            totalDeduction,
            currentMonthSalary,
        };
    };

    const stats = getStatistics();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const columns = [
        {
            title: "Month/Year",
            key: "monthYear",
            width: 150,
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 16 }}>
                        {dayjs(`${record.year}-${record.month}-01`).format("MMMM")}
                    </Text>
                    <Text type="secondary">{record.year}</Text>
                </Space>
            ),
            sorter: (a, b) => {
                const dateA = new Date(a.year, a.month - 1);
                const dateB = new Date(b.year, b.month - 1);
                return dateB - dateA;
            },
            defaultSortOrder: "ascend",
        },
        {
            title: "Hours Worked",
            dataIndex: "totalHoursWorked",
            key: "totalHoursWorked",
            width: 130,
            align: "center",
            render: (hours) => (
                <Tag icon={<ClockCircleOutlined />} color="blue">
                    {hours || 0}h
                </Tag>
            ),
        },
        {
            title: "Hourly Rate",
            dataIndex: "hourlyRate",
            key: "hourlyRate",
            width: 130,
            align: "center",
            render: (rate) => (
                <Text strong style={{ color: "#1890ff" }}>
                    {formatCurrency(rate || 0)}/h
                </Text>
            ),
        },
        {
            title: "Base Salary",
            dataIndex: "baseSalary",
            key: "baseSalary",
            width: 150,
            align: "right",
            render: (amount) => (
                <Text strong style={{ fontSize: 15 }}>
                    {formatCurrency(amount || 0)}
                </Text>
            ),
        },
        {
            title: "Bonus",
            dataIndex: "bonus",
            key: "bonus",
            width: 120,
            align: "right",
            render: (bonus) =>
                bonus > 0 ? (
                    <Tag icon={<RiseOutlined />} color="success">
                        +{formatCurrency(bonus)}
                    </Tag>
                ) : (
                    <Text type="secondary">-</Text>
                ),
        },
        {
            title: "Deduction",
            dataIndex: "deduction",
            key: "deduction",
            width: 120,
            align: "right",
            render: (deduction) =>
                deduction > 0 ? (
                    <Tag icon={<FallOutlined />} color="error">
                        -{formatCurrency(deduction)}
                    </Tag>
                ) : (
                    <Text type="secondary">-</Text>
                ),
        },
        {
            title: "Total Salary",
            dataIndex: "totalSalary",
            key: "totalSalary",
            width: 150,
            align: "right",
            fixed: "right",
            render: (amount) => (
                <Text strong style={{ fontSize: 16, color: "#52c41a" }}>
                    {formatCurrency(amount || 0)}
                </Text>
            ),
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            width: 150,
            ellipsis: true,
            render: (note) =>
                note ? (
                    <Tooltip title={note}>
                        <Text type="secondary" ellipsis>
                            <FileTextOutlined /> {note}
                        </Text>
                    </Tooltip>
                ) : (
                    <Text type="secondary">-</Text>
                ),
        },
    ];

    if (loading) {
        return (
            <div className="my-salary-page">
                <div className="loading-container">
                    <Spin size="large" tip="Loading salary information..." />
                </div>
            </div>
        );
    }

    if (!hourlyRate) {
        return (
            <div className="my-salary-page">
                <div className="page-header">
                    <Title level={2} className="page-title">
                        <DollarOutlined /> My Salary
                    </Title>
                    <div className="page-subtitle">View your salary history</div>
                </div>
                <Alert
                    message="Hourly Rate Not Set"
                    description="Your hourly rate has not been set. Please contact HR department."
                    type="warning"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="my-salary-page">
            {/* Page Header */}
            <div className="page-header">
                <Title level={2} className="page-title">
                    <DollarOutlined /> My Salary
                </Title>
                <div className="page-subtitle">
                    Track your salary history and earnings
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-cards">
                <Card className="stat-card">
                    <div className="stat-icon all">
                        <CalendarOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {formatCurrency(stats.currentMonthSalary)}
                        </div>
                        <div className="stat-label">Current Month</div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon approved">
                        <DollarOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {formatCurrency(stats.averageSalary)}
                        </div>
                        <div className="stat-label">Average Salary</div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon pending">
                        <TrophyOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {formatCurrency(stats.highestSalary)}
                        </div>
                        <div className="stat-label">Highest Salary</div>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon rejected">
                        <RiseOutlined />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {formatCurrency(stats.totalBonus)}
                        </div>
                        <div className="stat-label">Total Bonus</div>
                    </div>
                </Card>
            </div>

            {/* Salary Chart Component */}
            <SalaryChart
                monthlySalaries={monthlySalaries}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
            />

            {/* Salary Table */}
            <Card
                title={
                    <Space>
                        <FileTextOutlined />
                        <span>Salary History</span>
                    </Space>
                }
                style={{ marginTop: 24 }}
            >
                <Table
                    columns={columns}
                    dataSource={monthlySalaries}
                    rowKey="_id"
                    loading={loading}
                    scroll={{ x: 1200 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} records`,
                        pageSizeOptions: ["10", "20", "50"],
                    }}
                    locale={{
                        emptyText: (
                            <Alert
                                message="No Salary Records"
                                description="You don't have any salary records yet."
                                type="info"
                                showIcon
                            />
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default MySalary;