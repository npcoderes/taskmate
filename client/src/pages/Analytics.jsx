import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Spin } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTasks, useAppDispatch } from '../store/hooks';
import { fetchAnalytics } from '../store/slices/tasksSlice';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  ArcElement
);

const { Title } = Typography;

const Analytics = () => {
  const dispatch = useAppDispatch();
  const { analytics, isLoading } = useTasks();

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>No analytics data available</Title>
      </div>
    );
  }

  const barChartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [analytics.pending, analytics.in_progress, analytics.completed],
        backgroundColor: [
          'rgba(250, 140, 22, 0.8)',
          'rgba(24, 144, 255, 0.8)',
          'rgba(82, 196, 26, 0.8)',
        ],
        borderColor: [
          'rgba(250, 140, 22, 1)',
          'rgba(24, 144, 255, 1)',
          'rgba(82, 196, 26, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [analytics.pending, analytics.in_progress, analytics.completed],
        backgroundColor: [
          '#fa8c16',
          '#1890ff',
          '#52c41a',
        ],
        borderColor: [
          '#fa8c16',
          '#1890ff',
          '#52c41a',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Task Status Overview',
      },
    },
  };

  const completionRate = analytics.total > 0 
    ? Math.round((analytics.completed / analytics.total) * 100) 
    : 0;

  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Analytics Dashboard
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card 
            variant="outlined"
            style={{ 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Statistic
              title="Total Tasks"
              value={analytics.total}
              prefix={<UnorderedListOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card 
            variant="outlined"
            style={{ 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Statistic
              title="Pending"
              value={analytics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card 
            variant="outlined"
            style={{ 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Statistic
              title="In Progress"
              value={analytics.in_progress}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Card 
            variant="outlined"
            style={{ 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Statistic
              title="Completed"
              value={analytics.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card 
            variant="outlined"
            style={{ 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Statistic
              title="Completion Rate"
              value={completionRate}
              suffix="%"
              valueStyle={{ 
                color: completionRate >= 70 ? '#52c41a' : 
                       completionRate >= 40 ? '#fa8c16' : '#ff4d4f',
                fontSize: '24px'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card 
            variant="outlined"
            style={{ 
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <Statistic
              title="Active Tasks"
              value={analytics.pending + analytics.in_progress}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card 
            title="Task Distribution" 
            variant="outlined"
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <div style={{ height: '280px', width: '100%' }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <Card 
            title="Task Status Overview" 
            variant="outlined"
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              borderRadius: '8px'
            }}
          >
            <div style={{ height: '280px', width: '100%' }}>
              <Doughnut data={doughnutChartData} options={doughnutOptions} />
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Analytics;
