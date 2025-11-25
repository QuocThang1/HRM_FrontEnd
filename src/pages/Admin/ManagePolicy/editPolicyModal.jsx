import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Switch, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { updatePolicyApi } from "../../../utils/Api/policyApi";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

const EditPolicyModal = ({
  visible,
  onCancel,
  onSuccess,
  policy,
  categories,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && policy) {
      form.setFieldsValue({
        title: policy.title,
        category: policy.category,
        content: policy.content,
        isActive: policy.isActive,
      });
    }
  }, [visible, policy, form]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const res = await updatePolicyApi(policy._id, values);

      if (res.EC === 0) {
        toast.success("Policy updated successfully");
        onSuccess();
      } else {
        toast.error(res.EM || "Failed to update policy");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      toast.error("Failed to update policy");
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
          <span>Edit Policy</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Policy Title"
          name="title"
          rules={[
            { required: true, message: "Please enter policy title" },
            {
              min: 5,
              message: "Title must be at least 5 characters",
            },
          ]}
        >
          <Input
            placeholder="Enter policy title"
            size="large"
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category" size="large">
            {categories.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Policy Content"
          name="content"
          rules={[
            {
              required: true,
              message: "Please enter policy content",
            },
            {
              min: 20,
              message: "Content must be at least 20 characters",
            },
          ]}
        >
          <TextArea
            rows={12}
            placeholder="Enter policy content..."
            maxLength={5000}
            showCount
          />
        </Form.Item>

        <Form.Item label="Status" name="isActive" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
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
              {submitting ? "Updating..." : "Update Policy"}
            </button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPolicyModal;
