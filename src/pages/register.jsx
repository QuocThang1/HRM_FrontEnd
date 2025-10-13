import {
  Button,
  Form,
  Input,
  notification,
  Card,
  Typography,
  Select,
  Row,
  Col,
} from "antd";
import { signUpApi } from "../utils/Api/accountApi.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, email, password, address, phone, gender } = values;

    const res = await signUpApi(
      name,
      email,
      password,
      address,
      phone,
      gender,
    );

    if (res) {
      if (res.EC === 1) {
        notification.error({
          message: "Registration Failed",
          description: res.EM,
        });
        return;
      } else {
        notification.success({
          message: "Registration Successful",
          description: "You have successfully registered.",
        });
        navigate("/login");
      }
    } else {
      notification.error({
        message: "Registration Failed",
        description:
          "There was an error during registration. Please try again.",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      }}
    >
      <Card
        style={{
          width: 600,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          borderRadius: 16,
          padding: 24,
        }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 0 }}>
            Đăng ký tài khoản
          </Title>
          <Text type="secondary">Tạo tài khoản mới để sử dụng dịch vụ</Text>
        </div>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input size="large" placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
                ]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input size="large" placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input size="large" placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{9,12}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input size="large" placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select size="large" placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Text>
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
