import { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Space, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { updateContractApi } from "../../../utils/Api/contractApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const EditContractModal = ({ visible, onCancel, onSuccess, contract }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (visible && contract) {
            form.setFieldsValue({
                dateRange: [dayjs(contract.fromDate), dayjs(contract.toDate)],
                content: contract.content,
                status: contract.status,
            });
        }
    }, [visible, contract, form]);

    const handleSubmit = async (values) => {
        try {
            setSubmitting(true);
            const [fromDate, toDate] = values.dateRange;

            const updateData = {
                content: values.content,
                fromDate: fromDate.toISOString(),
                toDate: toDate.toISOString(),
                status: values.status,
            };

            const res = await updateContractApi(contract._id, updateData);

            if (res.EC === 0) {
                toast.success("Contract updated successfully");
                onSuccess();
            } else {
                toast.error(res.EM || "Failed to update contract");
            }
        } catch (error) {
            console.error("Error updating contract:", error);
            toast.error("Failed to update contract");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <EditOutlined style={{ color: "#1890ff" }} />
                    <span>Edit Contract</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={700}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                        placeholder={["From Date", "To Date"]}
                    />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Please select status" }]}
                >
                    <Select placeholder="Select status">
                        <Option value="active">Active</Option>
                        <Option value="expired">Expired</Option>
                    </Select>
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
                            {submitting ? "Updating..." : "Update Contract"}
                        </button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditContractModal;