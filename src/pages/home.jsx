import { Button, Row, Col, Card, Statistic } from "antd";
import {
  RocketOutlined,
  TeamOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FolderOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import "../styles/home.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const features = [
    {
      icon: <UserOutlined />,
      title: "Employee Management",
      description: "Manage employee profiles, documents, and personal information efficiently.",
    },
    {
      icon: <FolderOutlined />,
      title: "Department Organization",
      description: "Organize teams and departments with clear hierarchies and reporting structures.",
    },
    {
      icon: <BarChartOutlined />,
      title: "Performance Tracking",
      description: "Track employee performance with comprehensive review and feedback systems.",
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Time Management",
      description: "Monitor attendance, leave requests, and working hours seamlessly.",
    },
  ];

  const stats = [
    { title: "Active Users", value: 1250, icon: <UserOutlined /> },
    { title: "Departments", value: 28, icon: <FolderOutlined /> },
    { title: "Tasks Completed", value: 3840, icon: <CheckCircleOutlined /> },
    { title: "Projects", value: 156, icon: <RocketOutlined /> },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">HRM System</span>
            </h1>
            <p className="hero-subtitle">
              Streamline your HR operations with our comprehensive human resource management solution.
              Empower your workforce and drive organizational success.
            </p>
            <div className="hero-buttons">
              {auth?.isAuthenticated ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  onClick={() => navigate("/profile")}
                  className="hero-btn-primary"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={() => navigate("/login")}
                    className="hero-btn-primary"
                  >
                    Get Started
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate("/about")}
                    className="hero-btn-secondary"
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <TeamOutlined style={{ fontSize: 32, color: "#667eea" }} />
              <div>Team Collaboration</div>
            </div>
            <div className="floating-card card-2">
              <SafetyOutlined style={{ fontSize: 32, color: "#764ba2" }} />
              <div>Secure & Reliable</div>
            </div>
            <div className="floating-card card-3">
              <BarChartOutlined style={{ fontSize: 32, color: "#f093fb" }} />
              <div>Real-time Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="stat-card">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    valueStyle={{ color: "#667eea", fontWeight: 700 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to manage your workforce effectively
            </p>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of companies already using our HRM system
            </p>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => navigate(auth?.isAuthenticated ? "/profile" : "/login")}
              className="cta-button"
            >
              {auth?.isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;