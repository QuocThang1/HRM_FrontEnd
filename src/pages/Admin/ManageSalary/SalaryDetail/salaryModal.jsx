import { Modal, Form, InputNumber, Button, Space } from "antd";

const SalaryModal = ({ visible, type, onClose, onSubmit, form }) => {
    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={type === "create" ? "Create Salary" : "Update Salary"}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={500}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    label="Hourly Rate (USD)"
                    name="hourlyRate"
                    rules={[
                        { required: true, message: "Please enter hourly rate" },
                        {
                            type: "number",
                            min: 0,
                            message: "Hourly rate must be greater than or equal to 0",
                        },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        prefix="$"
                        suffix="/hour"
                        placeholder="Enter hourly rate"
                        min={0}
                        precision={2}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                    <Space>
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            {type === "create" ? "Create" : "Update"}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SalaryModal;