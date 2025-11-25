import { useState } from "react";
import { Modal, Form, Input, DatePicker, Space } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { createContractApi } from "../../../utils/Api/contractApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CreateContractModal = ({ visible, onCancel, onSuccess, staffId }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);
            const [fromDate, toDate] = values.dateRange;

            const res = await createContractApi(
                staffId,
                values.content,
                fromDate.toISOString(),
                toDate.toISOString()
            );

            if (res.EC === 0) {
                toast.success("Contract created successfully");
                form.resetFields();
                onSuccess();
            } else {
                toast.error(res.EM || "Failed to create contract");
            }
        } catch (error) {
            console.error("Error creating contract:", error);
            toast.error(
                error.response?.data?.EM || "Failed to create contract"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const disabledDate = (current) => {
        return current && current < dayjs().startOf("day");
    };

    return (
        <Modal
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FileAddOutlined style={{ color: "#1890ff" }} />
                    <span>Create New Contract</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={700}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Contract Period"
                    name="dateRange"
                    rules={[
                        {
                            required: true,
                            message: "Please select contract period",
                        },
                    ]}
                >
                    <RangePicker
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                        disabledDate={disabledDate}
                        placeholder={["From Date", "To Date"]}
                    />
                </Form.Item>

                <Form.Item
                    label="Contract Content"
                    name="content"
                    rules={[
                        {
                            required: true,
                            message: "Please enter contract content",
                        },
                        {
                            min: 20,
                            message: "Content must be at least 20 characters",
                        },
                    ]}
                >
                    <TextArea
                        rows={12}
                        placeholder="Enter contract content details..."
                        maxLength={5000}
                        showCount
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            className="ant-btn-default"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ant-btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Creating..." : "Create Contract"}
                        </button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateContractModal;