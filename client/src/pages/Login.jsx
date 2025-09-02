import React, { useEffect } from "react";
import { Form, Input, Button, Card, Typography, message, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/slices/authSlice";

const { Title, Text } = Typography;

const Login = () => {
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
    const loadingMessage = message.loading("Signing in...", 0);

    try {
      const result = await dispatch(loginUser(values));

      loadingMessage();

      if (loginUser.fulfilled.match(result)) {
        message.success("Login successful!");
        navigate("/dashboard", { replace: true });
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

              <Text
                style={{
                  fontSize: "16px",
                  color: "#666",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Your Smart Task Management Partner
              </Text>

              <Text type="secondary" style={{ fontSize: "14px" }}>
                Welcome back! Please sign in to continue
              </Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
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
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                style={{ marginBottom: "16px" }}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
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
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Text type="secondary">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#667eea",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Create Account
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

export default Login;
