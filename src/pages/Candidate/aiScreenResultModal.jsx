import { Modal, Descriptions, Tag, Alert, Divider } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const AIScreenResultModal = ({ visible, result, onClose }) => {
  if (!result) return null;

  const { aiAnalysis } = result;
  const { extractedData, validation, shouldReject, rejectionReason, message } =
    aiAnalysis;

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>AI Screening Result</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="ai-screen-result-modal"
    >
      <Alert
        message={message}
        type={shouldReject ? "error" : "success"}
        style={{ marginBottom: 24 }}
      />

      <div className="validation-summary">
        <div className="summary-item">
          <span className="summary-label">Completion Rate:</span>
          <span className="summary-value">
            <Tag
              color={validation.completionRate === 100 ? "success" : "warning"}
            >
              {validation.completionRate}%
            </Tag>
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Found Fields:</span>
          <span className="summary-value">{validation.foundFields.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Missing Fields:</span>
          <span className="summary-value">
            {validation.missingFields.length}
          </span>
        </div>
      </div>

      <Divider>Extracted Information</Divider>

      {/* Extracted Data */}
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item
          label="Full Name"
          labelStyle={{ fontWeight: 600, width: 150 }}
        >
          {extractedData.fullName ? (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined /> {extractedData.fullName}
            </span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>
              <CloseCircleOutlined /> Not Found
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Email" labelStyle={{ fontWeight: 600 }}>
          {extractedData.email ? (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined /> {extractedData.email}
            </span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>
              <CloseCircleOutlined /> Not Found
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Phone" labelStyle={{ fontWeight: 600 }}>
          {extractedData.phone ? (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined /> {extractedData.phone}
            </span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>
              <CloseCircleOutlined /> Not Found
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Citizen ID" labelStyle={{ fontWeight: 600 }}>
          {extractedData.citizenId ? (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined /> {extractedData.citizenId}
            </span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>
              <CloseCircleOutlined /> Not Found
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label="Date of Birth"
          labelStyle={{ fontWeight: 600 }}
        >
          {extractedData.dob ? (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined /> {extractedData.dob}
            </span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>
              <CloseCircleOutlined /> Not Found
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Gender" labelStyle={{ fontWeight: 600 }}>
          {extractedData.gender ? (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined />{" "}
              {extractedData.gender.charAt(0).toUpperCase() +
                extractedData.gender.slice(1)}
            </span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>
              <CloseCircleOutlined /> Not Found
            </span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Address" labelStyle={{ fontWeight: 600 }}>
          {extractedData.address ? (
            <span style={{ color: "#52c41a" }}>
              <CheckCircleOutlined /> {extractedData.address}
            </span>
          ) : (
            <span style={{ color: "#ff4d4f" }}>
              <CloseCircleOutlined /> Not Found
            </span>
          )}
        </Descriptions.Item>
      </Descriptions>

      {/* Rejection Reason */}
      {shouldReject && rejectionReason && (
        <>
          <Divider>Rejection Reason</Divider>
          <Alert message={rejectionReason} type="error" showIcon />
        </>
      )}

      {/* Missing Fields List */}
      {validation.missingFields.length > 0 && (
        <>
          <Divider>Missing Fields</Divider>
          <div className="missing-fields-list">
            {validation.missingFields.map((field) => (
              <Tag key={field} color="error" style={{ marginBottom: 8 }}>
                <CloseCircleOutlined /> {field}
              </Tag>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
};

export default AIScreenResultModal;
