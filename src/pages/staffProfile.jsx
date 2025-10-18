import { useEffect, useContext, useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { AuthContext } from "../context/auth.context.jsx";
import { updateProfileApi, getAccountApi } from "../utils/Api/accountApi.js";
import { toast } from "react-toastify";

const { Title } = Typography;

const StaffProfilePage = () => {
  const { setAuth } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [shouldReloadAccount, setShouldReloadAccount] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      const res = await getAccountApi();
      if (res) {
        form.setFieldsValue({
          name: res.data.personalInfo?.fullName,
          email: res.data.personalInfo?.email,
          address: res.data.personalInfo?.address,
          phone: res.data.personalInfo?.phone,
        });

        setAuth({
          isAuthenticated: true,
          staff: {
            email: res.data.personalInfo?.email,
            name: res.data.personalInfo?.fullName,
            address: res.data.personalInfo?.address,
            phone: res.data.personalInfo?.phone,
            role: res.data.role,
          },
        });
      }
    };
    fetchAccount();
    setShouldReloadAccount(false);
  }, [setAuth, form, shouldReloadAccount]);

  const onFinish = async (values) => {
    try {
      const res = await updateProfileApi(
        values.name,
        values.email,
        values.address,
        values.phone,
      );
      if (res && res.EC === 0) {
        toast.success(res.EM, { autoClose: 2000 });
        setShouldReloadAccount(true);
      } else {
        toast.error(res.EM || "Cập nhật thất bại. Vui lòng thử lại.", { autoClose: 2000 });
      }
    } catch (err) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.", { autoClose: 2000 });
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
