import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Typography,
  Row,
  Col,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  updateUserProfilePic,
  updatePassword,
} from "../store/slices/authSlice";

const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values) => {
    try {
      const result = await dispatch(
        updateUserProfile({
          firstName: values.firstName,
          lastName: values.lastName,
        })
      );

      if (updateUserProfile.fulfilled.match(result)) {
        message.success("Profile updated successfully");
        setEditing(false);
      }
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const handleUploadProfilePic = async (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    if (info.file.status === "done" || info.file.originFileObj) {
      const formData = new FormData();
      formData.append("profilePic", info.file.originFileObj || info.file);

      try {
        setUploading(true);
        const result = await dispatch(updateUserProfilePic(formData));
        if (updateUserProfilePic.fulfilled.match(result)) {
          message.success("Profile picture updated successfully");
        }
      } catch (error) {
        message.error("Failed to update profile picture");
      }
      setUploading(false);
    }
  };

  const handleUpdatePassword = async (values) => {
    try {
      const result = await dispatch(
        updatePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      );

      if (updatePassword.fulfilled.match(result)) {
        message.success("Password updated successfully");
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error("Failed to update password");
    }
  };

  const uploadProps = {
    name: "profilePic",
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return false;
      }
      return true;
    },
    onChange: handleUploadProfilePic,
  };

  return (
    <div>
      <Title
        level={2}
        style={{
          marginBottom: "24px",
          color: "#1890ff",
          borderBottom: "2px solid #f0f0f0",
          paddingBottom: "12px",
        }}
      >
        My Profile
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #e8e8e8",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                src={user?.profilePic}
                icon={<UserOutlined />}
                style={{
                  marginBottom: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />

              <div style={{ marginBottom: "16px" }}>
                <Title level={4} style={{ margin: 0 }}>
                  {user?.firstName} {user?.lastName}
                </Title>
                <Text type="secondary">{user?.email}</Text>
              </div>

              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  loading={uploading}
                  style={{ width: "100%" }}
                >
                  {uploading ? "Uploading..." : "Change Profile Picture"}
                </Button>
              </Upload>
            </div>
          </Card>

          <Card
            title="Account Information"
            style={{
              marginTop: "16px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #e8e8e8",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Member Since:</Text>
                <br />
                <Text type="secondary">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </Text>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div>
                <Text strong>Last Updated:</Text>
                <br />
                <Text type="secondary">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "N/A"}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title="Personal Information"
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #e8e8e8",
              maxWidth: "900px",
            }}
            extra={
              <Button
                type={editing ? "default" : "primary"}
                icon={editing ? <SaveOutlined /> : <EditOutlined />}
                onClick={() => {
                  if (editing) {
                    form.submit();
                  } else {
                    setEditing(true);
                  }
                }}
                loading={loading}
              >
                {editing ? "Save Changes" : "Edit Profile"}
              </Button>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              disabled={!editing}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    style={{ marginBottom: "16px" }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your first name",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your first name"
                      style={{ borderRadius: "6px", height: "40px" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    style={{ marginBottom: "16px" }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your last name",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your last name"
                      style={{ borderRadius: "6px", height: "40px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email Address"
                style={{ marginBottom: "16px" }}
              >
                <Input
                  placeholder="Enter your email"
                  disabled
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              {editing && (
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => {
                        setEditing(false);
                        form.setFieldsValue({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              )}
            </Form>
          </Card>

          <Card
            title={
              <Space>
                <LockOutlined />
                Change Password
              </Space>
            }
            style={{
                 marginTop: "16px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #e8e8e8",
              maxWidth: "600px",
            }}
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleUpdatePassword}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                style={{ marginBottom: "16px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Enter current password"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                style={{ marginBottom: "16px" }}
                rules={[
                  { required: true, message: "Please enter new password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                style={{ marginBottom: "16px" }}
                rules={[
                  { required: true, message: "Please confirm new password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm new password"
                  style={{ borderRadius: "6px", height: "40px" }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LockOutlined />}
                  style={{ width: "100%" }}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Profile;
