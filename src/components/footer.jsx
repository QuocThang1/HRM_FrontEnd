import { Layout, Row, Col, Space } from "antd";
import {
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    GithubOutlined,
} from "@ant-design/icons";
import "../styles/footer.css";

const { Footer: AntFooter } = Layout;

const Footer = () => {
    return (
        <AntFooter className="custom-footer">
            <div className="footer-content">
                <Row gutter={[32, 32]}>
                    {/* Company Info */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="footer-section">
                            <h3 className="footer-title">HRM System</h3>
                            <p className="footer-description">
                                Leading Human Resource Management solution for modern businesses.
                                Streamline your HR processes and empower your workforce.
                            </p>
                            <Space className="footer-social">
                                <a href="#" className="social-icon">
                                    <FacebookOutlined />
                                </a>
                                <a href="#" className="social-icon">
                                    <TwitterOutlined />
                                </a>
                                <a href="#" className="social-icon">
                                    <LinkedinOutlined />
                                </a>
                                <a href="#" className="social-icon">
                                    <GithubOutlined />
                                </a>
                            </Space>
                        </div>
                    </Col>

                    {/* Quick Links */}
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <div className="footer-section">
                            <h3 className="footer-title">Quick Links</h3>
                            <ul className="footer-links">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Services</a></li>
                                <li><a href="#">Features</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Blog</a></li>
                            </ul>
                        </div>
                    </Col>

                    {/* Contact Info */}
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <div className="footer-section">
                            <h3 className="footer-title">Contact Us</h3>
                            <ul className="footer-contact">
                                <li>
                                    <EnvironmentOutlined className="contact-icon" />
                                    <span>123 Business Street, Tech District, Ho Chi Minh City, Vietnam</span>
                                </li>
                                <li>
                                    <PhoneOutlined className="contact-icon" />
                                    <span>+84 123 456 789</span>
                                </li>
                                <li>
                                    <MailOutlined className="contact-icon" />
                                    <span>contact@hrmsystem.com</span>
                                </li>
                            </ul>
                        </div>
                    </Col>
                </Row>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-copyright">
                        © {new Date().getFullYear()} HRM System. All rights reserved.
                    </div>
                    <div className="footer-legal">
                        <a href="#">Privacy Policy</a>
                        <span className="separator">|</span>
                        <a href="#">Terms of Service</a>
                        <span className="separator">|</span>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;