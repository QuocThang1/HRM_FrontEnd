import { useEffect, useContext } from "react";
import { Form, Input, Button, Card, Typography, notification } from "antd";
import { AuthContext } from "../context/auth.context.jsx";
import { updateProfileApi } from "../utils/api.js";
import axios from "../utils/axios.customize.js";

const { Title } = Typography;

const StaffProfilePage = () => {
  const { setAuth } = useContext(AuthContext);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await axios.get(`/v1/api/account`);
      if (res) {
        form.setFieldsValue({
          name: res.personalInfo?.fullName,
          email: res.personalInfo?.email,
          address: res.personalInfo?.address,
          phone: res.personalInfo?.phone,
        });
      }
    };
    fetchAccount();
  }, [setAuth, form]);

  const onFinish = async (values) => {
    try {
      const res = await updateProfileApi(
        values.name,
        values.email,
        values.address,
        values.phone,
      );
      console.log("res", res);
      if (res && res.EC === 0) {
        notification.success({
          message: "Cập nhật thành công",
          description: "Thông tin cá nhân đã được cập nhật.",
        });

        setAuth({
          isAuthenticated: true,
          staff: {
            email: values.email,
            name: values.name,
            address: values.address,
            phone: values.phone,
          },
        });
      } else {
        notification.error({
          message: "Cập nhật thất bại",
          description: res.data.EM || "Có lỗi xảy ra.",
        });
      }
    } catch (err) {
      notification.error({
        message: "Cập nhật thất bại",
        description: "Không thể kết nối máy chủ.",
      });
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#f6f9fb",
        padding: "32px 0 0 0",
      }}
    >
      <Card
        style={{
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          margin: "0 auto",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Thông tin cá nhân
        </Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StaffProfilePage;
