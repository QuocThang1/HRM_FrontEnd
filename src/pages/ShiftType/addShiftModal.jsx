import { Modal, Form, Input, TimePicker, InputNumber, Switch, Row, Col, Divider } from "antd";
import { ClockCircleOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { createShiftTypeApi } from "../../utils/Api/shiftTypeApi";
import { toast } from "react-toastify";
import "../../styles/shiftModal.css";

const AddShiftModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Format time to HH:00
            const submitData = {
                ...values,
                fromTime: values.fromTime.format("HH:00"),
                toTime: values.toTime.format("HH:00"),
                isOvertime: values.isOvertime ? "overtime" : "normal"
            };

            console.log("Submit data:", submitData);
            const res = await createShiftTypeApi(submitData);

            if (res.EC === 0) {
                toast.success(res.EM, { autoClose: 2000 });
            } else {
                toast.error(res.EM, { autoClose: 2000 });
                return;
            }
            form.resetFields();
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error creating shift:", error);
            toast.error("Failed to create shift", { autoClose: 2000 });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const validateToTime = (_, value) => {
        const fromTime = form.getFieldValue('fromTime');
        if (!value || !fromTime) {
            return Promise.resolve();
        }

        // so sánh giờ, cho phép toTime là giờ ngày tiếp theo
        let diff = value.hour() - fromTime.hour();
        if (diff <= 0) diff += 24; // nếu toTime nhỏ hơn hoặc bằng => tính là ngày tiếp theo
        if (diff <= 0) {
            return Promise.reject(new Error('End time must be after start time!'));
        }
        return Promise.resolve();
    };

    const handleFromTimeChange = (time) => {
        if (!time) {
            form.setFieldsValue({ toTime: undefined });
            form.validateFields(['toTime']).catch(() => { });
            return;
        }
        const defaultTo = time.add(8, 'hour');
        form.setFieldsValue({ toTime: defaultTo });
        form.validateFields(['toTime']).catch(() => { });
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClockCircleOutlined style={{ color: '#667eea' }} />
                    <span>Add New Shift</span>
                </div>
            }
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            okText="Create"
            cancelText="Cancel"
            width={650}
            className="shift-modal"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    isOvertime: false,
                    allowedLateMinute: 0,
                    allowedEarlyLeaveMinute: 0
                }}
            >
                {/* Basic Info Section */}
                <div className="form-section">
                    <h4 className="section-title">Basic Information</h4>

                    <Form.Item
                        label="Shift Code"
                        name="shiftCode"
                        rules={[
                            { required: true, message: "Please input shift code!" },
                            { min: 2, message: "Shift code must be at least 2 characters!" }
                        ]}
                        tooltip="Unique identifier for the shift (e.g., MORNING, NIGHT)"
                    >
                        <Input
                            placeholder="e.g., MORNING, AFTERNOON, NIGHT"
                            prefix={<FieldTimeOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        tooltip="Brief description of the shift"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter shift description (optional)"
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>
                </div>

                <Divider />

                {/* Time Range Section */}
                <div className="form-section">
                    <h4 className="section-title">Time Range</h4>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="From Time"
                                name="fromTime"
                                rules={[
                                    { required: true, message: "Please select start time!" },
                                ]}
                            >
                                <TimePicker
                                    format="HH:00"
                                    placeholder="Select start hour"
                                    style={{ width: "100%" }}
                                    size="large"
                                    showNow={false}
                                    hideDisabledOptions
                                    onChange={handleFromTimeChange}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="To Time"
                                name="toTime"
                                rules={[
                                    { required: true, message: "Please select end time!" },
                                    { validator: validateToTime }
                                ]}
                                dependencies={['fromTime']}
                            >
                                <TimePicker
                                    format="HH:00"
                                    placeholder="Select end hour"
                                    style={{ width: "100%" }}
                                    size="large"
                                    showNow={false}
                                    hideDisabledOptions
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Divider />

                {/* Tolerance Settings Section */}
                <div className="form-section">
                    <h4 className="section-title">Tolerance Settings</h4>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Allowed Late Minutes"
                                name="allowedLateMinute"
                                rules={[
                                    { required: true, message: "Please input allowed late minutes!" },
                                ]}
                                tooltip="Maximum minutes an employee can be late"
                            >
                                <InputNumber
                                    min={0}
                                    max={60}
                                    placeholder="0-60 minutes"
                                    style={{ width: "100%" }}
                                    size="large"
                                    addonAfter="min"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Allowed Early Leave Minutes"
                                name="allowedEarlyLeaveMinute"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input allowed early leave minutes!",
                                    },
                                ]}
                                tooltip="Maximum minutes an employee can leave early"
                            >
                                <InputNumber
                                    min={0}
                                    max={60}
                                    placeholder="0-60 minutes"
                                    style={{ width: "100%" }}
                                    size="large"
                                    addonAfter="min"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <Divider />

                {/* Shift Type Section */}
                <div className="form-section">
                    <h4 className="section-title">Shift Type</h4>

                    <Form.Item
                        label="Is Overtime Shift"
                        name="isOvertime"
                        valuePropName="checked"
                        tooltip="Mark as overtime shift for additional pay calculations"
                    >
                        <Switch
                            checkedChildren="Overtime"
                            unCheckedChildren="Normal"
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default AddShiftModal;