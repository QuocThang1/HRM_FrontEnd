import { Layout, Row, Col, Card, Timeline, Statistic } from "antd";
import {
  RocketOutlined,
  TeamOutlined,
  TrophyOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  BulbOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import companyImage from "../assets/images/infopicture4.jpg";
import "../styles/about.css";

const { Content } = Layout;

const AboutPage = () => {
  const stats = [
    {
      title: "Years of Experience",
      value: 10,
      suffix: "+",
      icon: <TrophyOutlined />,
    },
    {
      title: "Happy Clients",
      value: 500,
      suffix: "+",
      icon: <HeartOutlined />,
    },
    { title: "Team Members", value: 50, suffix: "+", icon: <TeamOutlined /> },
    { title: "Countries", value: 15, suffix: "+", icon: <GlobalOutlined /> },
  ];

  const coreValues = [
    {
      icon: <BulbOutlined />,
      title: "Innovation",
      description:
        "We constantly innovate to provide cutting-edge HR solutions that meet modern workforce needs.",
    },
    {
      icon: <SafetyOutlined />,
      title: "Trust & Security",
      description:
        "Your data security and privacy are our top priorities. We maintain the highest security standards.",
    },
    {
      icon: <TeamOutlined />,
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do, ensuring their success is our success.",
    },
    {
      icon: <RocketOutlined />,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our service, from product quality to customer support.",
    },
  ];

  const milestones = [
    {
      year: "2015",
      title: "Company Founded",
      description: "Started our journey to revolutionize HR management.",
    },
    {
      year: "2017",
      title: "First 100 Clients",
      description:
        "Reached our first major milestone with 100 satisfied clients.",
    },
    {
      year: "2019",
      title: "International Expansion",
      description: "Expanded our services to 10+ countries across Asia.",
    },
    {
      year: "2021",
      title: "AI Integration",
      description: "Launched AI-powered recruitment and performance analytics.",
    },
    {
      year: "2024",
      title: "Industry Leader",
      description: "Recognized as a leading HR management solution provider.",
    },
  ];

  return (
    <Layout className="about-page">
      <Content>
        {/* Hero Section with Image */}
        <section className="about-hero">
          <div className="about-hero-overlay"></div>
          <img src={companyImage} alt="Company" className="about-hero-image" />
          <div className="about-hero-content">
            <h1 className="about-hero-title">About Personnel Hub</h1>
            <p className="about-hero-subtitle">
              Empowering Organizations with Smart HR Solutions
            </p>
          </div>
        </section>

        {/* Company Overview */}
        <section className="about-overview">
          <div className="container">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} lg={12}>
                <div className="about-text">
                  <h2 className="section-title">Who We Are</h2>
                  <p className="about-description">
                    Personnel Hub is a leading provider of comprehensive Human
                    Resource Management solutions. Since our founding in 2015,
                    we have been dedicated to transforming the way organizations
                    manage their most valuable asset - their people.
                  </p>
                  <p className="about-description">
                    Our platform combines cutting-edge technology with intuitive
                    design to streamline HR processes, enhance employee
                    engagement, and drive organizational success. We serve
                    companies of all sizes, from startups to enterprises, across
                    multiple industries worldwide.
                  </p>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="about-mission">
                  <Card className="mission-card">
                    <h3>
                      <RocketOutlined /> Our Mission
                    </h3>
                    <p>
                      To empower organizations with innovative HR technology
                      that simplifies workforce management and unlocks human
                      potential.
                    </p>
                  </Card>
                  <Card className="mission-card">
                    <h3>
                      <GlobalOutlined /> Our Vision
                    </h3>
                    <p>
                      To become the world is most trusted and comprehensive HR
                      management platform, transforming how businesses manage
                      and develop their workforce.
                    </p>
                  </Card>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Statistics */}
        <section className="about-stats">
          <div className="container">
            <Row gutter={[32, 32]}>
              {stats.map((stat, index) => (
                <Col xs={12} sm={12} lg={6} key={index}>
                  <Card className="stat-card">
                    <div className="stat-icon">{stat.icon}</div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      suffix={stat.suffix}
                      valueStyle={{
                        color: "#2563eb",
                        fontSize: "36px",
                        fontWeight: "bold",
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Core Values */}
        <section className="about-values">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Core Values</h2>
              <p className="section-subtitle">
                The principles that guide everything we do
              </p>
            </div>
            <Row gutter={[32, 32]}>
              {coreValues.map((value, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className="value-card">
                    <div className="value-icon">{value.icon}</div>
                    <h3 className="value-title">{value.title}</h3>
                    <p className="value-description">{value.description}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Timeline */}
        <section className="about-timeline">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Journey</h2>
              <p className="section-subtitle">
                Major milestones in our company growth
              </p>
            </div>
            <Timeline
              mode="alternate"
              className="custom-timeline"
              items={milestones.map((milestone) => ({
                dot: <CheckCircleOutlined className="timeline-icon" />,
                children: (
                  <Card className="timeline-card">
                    <div className="timeline-year">{milestone.year}</div>
                    <h3 className="timeline-title">{milestone.title}</h3>
                    <p className="timeline-description">
                      {milestone.description}
                    </p>
                  </Card>
                ),
              }))}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">
                Ready to Transform Your HR Management?
              </h2>
              <p className="cta-subtitle">
                Join thousands of companies that trust Personnel Hub for their
                HR needs
              </p>
              <div className="cta-buttons">
                <a href="/contact" className="cta-button primary">
                  Contact Us
                </a>
                <a href="/" className="cta-button secondary">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
      </Content>
    </Layout>
  );
};

export default AboutPage;
