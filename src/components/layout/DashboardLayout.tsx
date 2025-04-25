import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Layout, 
  Menu, 
  Avatar, 
  Dropdown, 
  Space, 
  Badge, 
  Button 
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MessageOutlined
} from '@ant-design/icons';
import NotificationsDropdown from '../NotificationsDropdown';
import ChatInterface from '../ChatInterface';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: '/profile',
        icon: <UserOutlined />,
        label: 'Profile',
      },
    ];

    switch (user?.role) {
      case 'super_admin':
        return [
          ...commonItems,
          {
            key: '/users',
            icon: <TeamOutlined />,
            label: 'User Management',
          },
          {
            key: '/restaurants',
            icon: <ShopOutlined />,
            label: 'Restaurant Management',
          },
          {
            key: '/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Order Management',
          },
          {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
        ];
      case 'admin':
        return [
          ...commonItems,
          {
            key: '/users',
            icon: <TeamOutlined />,
            label: 'User Management',
          },
          {
            key: '/restaurants',
            icon: <ShopOutlined />,
            label: 'Restaurant Management',
          },
          {
            key: '/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Order Management',
          },
        ];
      case 'restaurant_agent':
        return [
          ...commonItems,
          {
            key: '/restaurant/menu',
            icon: <ShopOutlined />,
            label: 'Menu Management',
          },
          {
            key: '/restaurant/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Restaurant Orders',
          },
        ];
      case 'delivery_agent':
        return [
          ...commonItems,
          {
            key: '/delivery/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Delivery Orders',
          },
        ];
      default:
        return commonItems;
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div style={{ height: 64, padding: '16px', textAlign: 'center' }}>
          <h2>BiteBuzz Hub</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Space size="large">
            <Badge count={5}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Badge count={3}>
              <Button type="text" icon={<MessageOutlined />} />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
      <NotificationsDropdown />
      <ChatInterface />
    </Layout>
  );
};

export default DashboardLayout; 