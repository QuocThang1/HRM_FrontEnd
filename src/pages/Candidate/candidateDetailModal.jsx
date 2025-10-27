import { Modal, Button, Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import "../../styles/candidateDetailModal.css";

const CandidateDetailModal = ({ visible, candidate, onClose }) => {
    const getStatusTag = (status) => {
        if (!status) {
            status = "pending";
        }

        const statusConfig = {
            pending: { color: "orange", icon: <ClockCircleOutlined /> },
            approved: { color: "green", icon: <CheckCircleOutlined /> },
            rejected: { color: "red", icon: <CloseCircleOutlined /> },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Tag color={config.color} icon={config.icon}>
                {status.toUpperCase()}
            </Tag>
        );
    };

    return (
        <Modal
            title="Candidate Details"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
                <Button
                    key="open"
                    type="primary"
                    href={candidate?.candidateInfo?.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!candidate?.candidateInfo?.cvUrl}
                >
                    Open CV in New Tab
                </Button>,
            ]}
            width={700}
            className="candidate-detail-modal"
        >
            {candidate && (
                <div className="candidate-details">
                    <div className="detail-row">
                        <span className="detail-label">Full Name:</span>
                        <span className="detail-value">
                            {candidate.personalInfo?.fullName || "-"}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">
                            {candidate.personalInfo?.email || "-"}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">
                            {candidate.personalInfo?.phone || "-"}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Gender:</span>
                        <span className="detail-value">
                            {candidate.personalInfo?.gender
                                ? candidate.personalInfo.gender
                                    .charAt(0)
                                    .toUpperCase() +
                                candidate.personalInfo.gender.slice(1)
                                : "-"}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">
                            {candidate.personalInfo?.address || "-"}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value">
                            {getStatusTag(candidate.candidateInfo?.status || "pending")}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">CV Link:</span>
                        <span className="detail-value">
                            {candidate.candidateInfo?.cvUrl ? (
                                <a
                                    href={candidate.candidateInfo.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {candidate.candidateInfo.cvUrl}
                                </a>
                            ) : (
                                "-"
                            )}
                        </span>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CandidateDetailModal;