import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Space,
  Tag,
  Popconfirm,
  Row,
  Col,
  Card,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../store/slices/tasksSlice";

const { Title } = Typography;
const { Option } = Select;

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();

  const statusOptions = [
    { value: "pending", label: "Pending", color: "orange" },
    { value: "in_progress", label: "In Progress", color: "blue" },
    { value: "completed", label: "Completed", color: "green" },
  ];

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue(task);
    setModalVisible(true);
  };

  const handleDeleteTask = async (id) => {
    try {
      const result = await dispatch(deleteTask(id));
      if (deleteTask.fulfilled.match(result)) {
        message.success("Task deleted successfully");
      }
    } catch (error) {
      message.error("Failed to delete task");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      let result;
      if (editingTask) {
        message.loading("Updating task...", 0);
        result = await dispatch(
          updateTask({ id: editingTask.id, taskData: values })
        );
        message.destroy();
        if (updateTask.fulfilled.match(result)) {
          message.success("Task updated successfully");
          setModalVisible(false);
          form.resetFields();
        } else {
          message.error("Failed to update task");
        }
      } else {
        message.loading("Creating task...", 0);
        result = await dispatch(createTask(values));
        message.destroy();
        if (createTask.fulfilled.match(result)) {
          message.success("Task created successfully");
          setModalVisible(false);
          form.resetFields();
        } else {
          message.error("Failed to create task");
        }
      }
    } catch (error) {
      message.destroy();
      message.error(
        editingTask ? "Failed to update task" : "Failed to create task"
      );
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      message.loading("Updating status...", 0);
      const result = await dispatch(updateTask({ id, taskData: { status } }));
      message.destroy();
      if (updateTask.fulfilled.match(result)) {
        message.success("Task status updated");
      } else {
        message.error("Failed to update task status");
      }
    } catch (error) {
      message.destroy();
      message.error("Failed to update task status");
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = statusOptions.find((opt) => opt.value === status);
    return (
      <Tag
        color={statusConfig?.color}
        icon={
          status === "completed" ? (
            <CheckCircleOutlined />
          ) : status === "in_progress" ? (
            <SyncOutlined spin />
          ) : (
            <ClockCircleOutlined />
          )
        }
      >
        {statusConfig?.label}
      </Tag>
    );
  };

  const getTaskCounts = () => {
    const counts = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
    return counts;
  };

  const taskCounts = getTaskCounts();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg"],
      className: "custom-header",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
      onFilter: (value, record) => record.status === value,
      responsive: ["sm", "md", "lg"],
      className: "custom-header",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ["md", "lg"],
      className: "custom-header",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      className: "custom-header",
      render: (_, record) => (
        <Space size="small" wrap>
          <Select
            value={record.status}
            onChange={(status) => handleStatusChange(record.id, status)}
            style={{ width: 100 }}
            size="small"
            loading={loading}
            disabled={loading}
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditTask(record)}
            size="small"
            disabled={loading}
          />
          <Popconfirm
            title="Delete task?"
            onConfirm={() => handleDeleteTask(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small"
              disabled={loading}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ marginBottom: "16px" }}>
          Tasks Management
        </Title>

        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="outlined"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <Statistic title="Total Tasks" value={taskCounts.total} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="outlined"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <Statistic
                title="Pending"
                value={taskCounts.pending}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="outlined"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <Statistic
                title="In Progress"
                value={taskCounts.in_progress}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              variant="outlined"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <Statistic
                title="Completed"
                value={taskCounts.completed}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateTask}
          style={{ marginBottom: "16px" }}
          block
          disabled={loading}
        >
          Add New Task
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800}}
        size="small"
      />

      <Modal
        title={editingTask ? "Edit Task" : "Create New Task"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
            initialValue="pending"
          >
            <Select placeholder="Select status">
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
              >
                {editingTask ? "Update" : "Create"}
              </Button>
              <Button 
                onClick={() => setModalVisible(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
