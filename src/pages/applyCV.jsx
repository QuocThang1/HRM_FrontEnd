import { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  LinkOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { submitCVApi } from "../utils/Api/candidateApi";
import "../styles/applyCV.css";

const ApplyCVPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await submitCVApi(values.cvUrl);
      if (res && res.EC === 0) {
        toast.success(res.EM || "CV submitted successfully!", {
          duration: 2000,
        });
        form.resetFields();
      } else {
        toast.error(res.EM || "Failed to submit CV. Please try again.", {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.error(
        "An error occurred while submitting your CV. Please try again.",
        { duration: 2000 },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-cv-page">
      {/* Hero Section */}
      <section className="apply-hero">
        <div className="apply-hero-overlay"></div>
        <div className="apply-hero-content" style={{ marginLeft: 38 }}>
          <h1 className="apply-hero-title">Join Our Team</h1>
          <p className="apply-hero-subtitle">
            Start your career journey with us. Share your CV link and we would
            get in touch!
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="apply-form-section">
        <div className="container">
          <div className="apply-form-wrapper">
            <Card className="apply-form-card">
              <div className="form-header">
                <h2 className="form-title">Submit Your Application</h2>
                <p className="form-description">
                  Fill in your CV link. We are looking forward to meeting you!
                </p>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Form.Item
                  label="CV Link"
                  name="cvUrl"
                  rules={[
                    { required: true, message: "Please enter your CV link" },
                    { type: "url", message: "Please enter a valid URL" },
                  ]}
                  tooltip="Share a link to your CV (Google Drive, Dropbox, OneDrive, etc.)"
                >
                  <Input
                    size="large"
                    prefix={<LinkOutlined />}
                    placeholder="https://drive.google.com/..."
                  />
                </Form.Item>

                <div className="cv-tips">
                  <h4>💡 Tips for sharing your CV:</h4>
                  <ul>
                    <li>
                      Upload your CV to Google Drive, Dropbox, or OneDrive
                    </li>
                    <li>
                      Make sure the link is set to Anyone with the link can view
                    </li>
                    <li>
                      Ensure your CV is in PDF format for best compatibility
                    </li>
                  </ul>
                </div>

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
                    Submit Application
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Info Card */}
            <Card className="info-card">
              <h3>Why Join Us?</h3>
              <ul className="benefits-list">
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>Competitive salary and benefits</span>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>Professional development opportunities</span>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>Modern work environment</span>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>Work-life balance</span>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>Friendly team culture</span>
                </li>
                <li>
                  <span className="benefit-icon">✓</span>
                  <span>Health insurance & annual leave</span>
                </li>
              </ul>

              <div className="contact-info">
                <h4>Need Help?</h4>
                <p>
                  <MailOutlined /> careers@hrmsystem.com
                </p>
                <p>
                  <PhoneOutlined /> +84 123 456 789
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplyCVPage;
