import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { createDepartmentReviewApi } from "../../../utils/Api/departmentApi";

const CreateDepartmentReviewModal = ({
  open,
  onClose,
  departmentId,
  adminId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const reviewData = {
        departmentId,
        adminId,
        month: dayjs(values.month).format("YYYY-MM"),
        score: values.score,
        comments: values.comments || "",
      };
      const res = await createDepartmentReviewApi(departmentId, reviewData);
      if (res && res.EC === 0) {
        toast.success(res.EM, { autoClose: 2000 });
        form.resetFields();
        onSuccess && onSuccess();
        onClose();
      } else {
        toast.error(res?.EM || "Failed to create review", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Failed to create review", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Department Review"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Create"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Month"
          name="month"
          rules={[{ required: true, message: "Please select month" }]}
        >
          <DatePicker
            picker="month"
            format="YYYY-MM"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Score"
          name="score"
          rules={[
            { required: true, message: "Please input score" },
            { type: "number", min: 1, max: 10, message: "Score must be 1-10" },
          ]}
        >
          <InputNumber step={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Comments" name="comments">
          <Input.TextArea rows={3} placeholder="Enter comments (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDepartmentReviewModal;
