import { useEffect, useState } from "react";
import { Modal, Form, DatePicker, InputNumber, Input } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { updateDepartmentReviewApi } from "../../../utils/Api/departmentApi";

const EditDepartmentReviewModal = ({ open, onClose, review, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && review) {
      form.setFieldsValue({
        month: review.month ? dayjs(review.month, "YYYY-MM") : undefined,
        score: review.score,
        comments: review.comments,
      });
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [open, review]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const score = Math.max(1, Math.min(10, Number(values.score)));
      const payload = {
        month: dayjs(values.month).format("YYYY-MM"),
        score,
        comments: values.comments || "",
      };
      setLoading(true);
      const res = await updateDepartmentReviewApi(review._id, payload);
      if (res && res.EC === 0) {
        toast.success(res.EM, { autoClose: 2000 });
        onSuccess && onSuccess();
      } else {
        toast.error(res.EM, { autoClose: 2000 });
      }
    } catch (err) {
      if (err.errorFields) return;
      toast.error("Failed to update review", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Department Review"
      open={open}
      onCancel={() => {
        onClose && onClose();
        form.resetFields();
      }}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Save"
      cancelText="Cancel"
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
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDepartmentReviewModal;
