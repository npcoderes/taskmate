import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Button, message } from 'antd';
import {
  UserOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setMobileMenuVisible(false);
      } else {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/dashboard/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
      onClick: () => {
        navigate('/dashboard/analytics');
        if (isMobile) setMobileMenuVisible(false);
      },
    },
    {
      key: '/dashboard/tasks',
      icon: <UnorderedListOutlined />,
      label: 'Tasks',
      onClick: () => {
        navigate('/dashboard/tasks');
        if (isMobile) setMobileMenuVisible(false);
      },
    },
    {
      key: '/dashboard/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        navigate('/dashboard/profile');
        if (isMobile) setMobileMenuVisible(false);
      },
    },
  ];

  const handleLogout = () => {
    message.success('Logout successful');
    window.history.pushState(null, '', '/login');
    window.history.pushState(null, '', '/login');
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    if (isMobile) {
      setMobileMenuVisible(!mobileMenuVisible);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile && mobileMenuVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 999,
          }}
          onClick={() => setMobileMenuVisible(false)}
        />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={isMobile ? !mobileMenuVisible : collapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        width={250}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          zIndex: 1000,
          border: '1px solid #e8e8e8',
          position: 'fixed',
          height: '100vh',
          left: isMobile ? (mobileMenuVisible ? 0 : -250) : 0,
          top: 0,
          transition: 'left 0.3s ease',
        }}
      >
        <div style={{
          height: '64px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: (isMobile ? false : collapsed) ? 'center' : 'flex-start',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          <div style={{
            width: (isMobile ? false : collapsed) ? '32px' : '40px',
            height: (isMobile ? false : collapsed) ? '32px' : '40px',
            backgroundColor: '#1890ff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: (isMobile ? false : collapsed) ? '0' : '12px',
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
          }}>
            <UnorderedListOutlined style={{ fontSize: (isMobile ? false : collapsed) ? '18px' : '20px', color: 'white' }} />
          </div>
          {!(isMobile ? false : collapsed) && (
            <Text strong style={{ 
              fontSize: '18px', 
              color: '#1890ff',
              fontWeight: '600'
            }}>
              TaskMate
            </Text>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            borderRight: 0, 
            marginTop: '16px',
            background: 'transparent'
          }}
          theme="light"
        />
      </Sider>
      
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 250),
        transition: 'margin-left 0.3s ease'
      }}>
        <Header
          style={{
            padding: '0 16px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderBottom: '1px solid #e8e8e8',
            position: 'sticky',
            top: 0,
            zIndex: 998,
          }}
        >
          <Button
            type="text"
            icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
            onClick={toggleMobileMenu}
            style={{ 
              fontSize: '16px', 
              width: 64, 
              height: 64,
              color: '#666'
            }}
          />
          
          <div style={{ flex: 1, marginLeft: '8px', overflow: 'hidden' }}>
            <Text style={{ 
              fontSize: isMobile ? '16px' : '20px', 
              fontWeight: '600', 
              color: '#1890ff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {location.pathname === '/dashboard/analytics' ? 'Analytics' :
               location.pathname === '/dashboard/tasks' ? 'Tasks' :
               location.pathname === '/dashboard/profile' ? 'Profile' : 'Dashboard'}
            </Text>
          </div>
          
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.3s',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e8e8e8',
              minWidth: 0
            }}
            className="user-dropdown"
            >
              <Avatar
                size="small"
                src={user?.profilePic}
                icon={<UserOutlined />}
                style={{ marginRight: isMobile ? '0' : '8px', flexShrink: 0 }}
              />
              {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
                  <Text style={{ color: '#1890ff', fontWeight: '600', fontSize: '14px' }}>
                    {user?.firstName} {user?.lastName}
                  </Text>
                  <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                    {user?.email}
                  </Text>
                </div>
              )}
            </div>
          </Dropdown>
        </Header>
        
        <Content
          style={{
            margin: isMobile ? '8px' : '16px',
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            minHeight: 'calc(100vh - 112px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
