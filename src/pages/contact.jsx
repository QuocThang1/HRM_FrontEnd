import { Row, Col, Card, Form, Input, Button, notification } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import "../styles/contact.css";

const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      notification.success({
        message: "Message Sent!",
        description:
          "Thank you for contacting us. We will get back to you soon.",
      });
      form.resetFields();
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <EnvironmentOutlined />,
      title: "Our Address",
      content: "123 Business Street, Tech District",
      subContent: "Ho Chi Minh City, Vietnam",
    },
    {
      icon: <PhoneOutlined />,
      title: "Phone Number",
      content: "+84 123 456 789",
      subContent: "+84 987 654 321",
    },
    {
      icon: <MailOutlined />,
      title: "Email Address",
      content: "contact@hrmsystem.com",
      subContent: "support@hrmsystem.com",
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Working Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM",
      subContent: "Saturday: 9:00 AM - 12:00 PM",
    },
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get In Touch</h1>
          <p className="contact-hero-subtitle">
            We would love to hear from you. Send us a message and we will
            respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            {contactInfo.map((info, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card className="contact-info-card" hoverable>
                  <div className="contact-info-icon">{info.icon}</div>
                  <h3 className="contact-info-title">{info.title}</h3>
                  <p className="contact-info-content">{info.content}</p>
                  {info.subContent && (
                    <p className="contact-info-subcontent">{info.subContent}</p>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={12}>
              <div className="contact-form-text">
                <h2 className="section-title">Send Us A Message</h2>
                <p className="section-description">
                  Have a question or need assistance? Fill out the form and our
                  team will get back to you within 24 hours.
                </p>
                <div className="contact-features">
                  <div className="contact-feature">
                    <div className="feature-icon">✓</div>
                    <div>
                      <h4>Quick Response</h4>
                      <p>We typically respond within 24 hours</p>
                    </div>
                  </div>
                  <div className="contact-feature">
                    <div className="feature-icon">✓</div>
                    <div>
                      <h4>Expert Support</h4>
                      <p>Our team of experts is ready to help</p>
                    </div>
                  </div>
                  <div className="contact-feature">
                    <div className="feature-icon">✓</div>
                    <div>
                      <h4>24/7 Availability</h4>
                      <p>Submit your inquiry anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Card className="contact-form-card">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                >
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please enter your name" },
                    ]}
                  >
                    <Input size="large" placeholder="John Doe" />
                  </Form.Item>

                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input size="large" placeholder="john@example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[
                      { required: true, message: "Please enter your phone" },
                    ]}
                  >
                    <Input size="large" placeholder="+84 123 456 789" />
                  </Form.Item>

                  <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[
                      { required: true, message: "Please enter subject" },
                    ]}
                  >
                    <Input size="large" placeholder="How can we help you?" />
                  </Form.Item>

                  <Form.Item
                    label="Message"
                    name="message"
                    rules={[
                      { required: true, message: "Please enter your message" },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      icon={<SendOutlined />}
                      block
                      className="submit-btn"
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325658623658!2d106.66408631533414!3d10.78294926203736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed2392c44df%3A0xd2ecb62e0d050fe9!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: 12 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
