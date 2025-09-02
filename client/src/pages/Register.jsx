import React, { useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/slices/authSlice";

const { Title, Text } = Typography;

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onFinish = async (values) => {
    const loadingMessage = message.loading("Creating account...", 0);

    try {
      const { confirmPassword, ...userData } = values;
      const result = await dispatch(registerUser(userData));

      loadingMessage();

      if (registerUser.fulfilled.match(result)) {
        message.success("Registration successful! Please login.");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      loadingMessage();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <Row justify="center" style={{ width: "100%", maxWidth: 500 }}>
        <Col span={24}>
          <Card
            style={{
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e8e8e8",
              backgroundColor: "white",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#1890ff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                }}
              >
                <CheckCircleOutlined
                  style={{ fontSize: "28px", color: "white" }}
                />
              </div>

              <Title
                level={2}
                style={{
                  marginBottom: "8px",
                  color: "#1890ff",
                  fontWeight: "600",
                }}
              >
                TaskMate
              </Title>

              <Text type="secondary" style={{ fontSize: "14px" }}>
                Create your account to get started
              </Text>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="firstName"
                label="First Name"
                style={{ marginBottom: "12px" }}
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your first name"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                style={{ marginBottom: "12px" }}
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your last name"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                style={{ marginBottom: "12px" }}
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                style={{ marginBottom: "12px" }}
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                style={{ marginBottom: "16px" }}
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm your password"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: "16px", marginTop: "16px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: "100%",
                    height: "42px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Text type="secondary">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#667eea",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Sign In
                  </Link>
                </Text>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
