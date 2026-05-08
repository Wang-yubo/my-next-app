'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layout,
  Menu,
  theme,
  ConfigProvider,
  App,
  Button,
  Space,
  Result,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  MonitorOutlined,
  ArrowLeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: '系统总览',
    permission: 'admin:dashboard',
  },
  {
    key: '/admin/users',
    icon: <TeamOutlined />,
    label: '用户管理',
    permission: 'admin:users',
  },
  {
    key: '/admin/permissions',
    icon: <SafetyOutlined />,
    label: '权限管理',
    permission: 'admin:permissions',
  },
  {
    key: '/admin/monitor',
    icon: <MonitorOutlined />,
    label: '系统监控',
    permission: 'admin:monitor',
  },
];

function getSelectedKey(pathname: string): string {
  if (pathname === '/admin') return '/admin';
  if (pathname.startsWith('/admin/users')) return '/admin/users';
  if (pathname.startsWith('/admin/permissions')) return '/admin/permissions';
  if (pathname.startsWith('/admin/monitor')) return '/admin/monitor';
  return '/admin';
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [permissions, setPermissions] = useState<string[] | null>(null);
  const {
    token: { colorBgContainer, borderRadiusLG, colorText, colorBorderSecondary },
  } = theme.useToken();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedPermissions = localStorage.getItem('user_permissions');
    if (savedPermissions) {
      setPermissions(JSON.parse(savedPermissions));
    } else {
      setPermissions([]);
    }
  }, []);

  const hasPermission = (required: string): boolean => {
    if (permissions === null) return true;
    if (permissions.length === 0) return true;
    return permissions.includes(required);
  };

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => hasPermission(item.permission));
  }, [permissions]);

  const currentItem = menuItems.find((item) => item.key === getSelectedKey(pathname));
  const isAllowed = currentItem ? hasPermission(currentItem.permission) : true;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <App><Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="light"
          style={{
            background: colorBgContainer,
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? 0 : '0 24px',
              borderBottom: `1px solid ${colorBorderSecondary}`,
            }}
          >
            {collapsed ? (
              <SettingOutlined style={{ fontSize: 24, color: '#1677ff' }} />
            ) : (
              <h1
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1677ff',
                }}
              >
                系统设置
              </h1>
            )}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey(pathname)]}
            items={filteredMenuItems.map((item) => ({
              ...item,
              label: <Link href={item.key}>{item.label}</Link>,
            }))}
            style={{
              borderRight: 0,
              marginTop: 8,
            }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: colorBgContainer,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${colorBorderSecondary}`,
            }}
          >
            <Space>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                style: { fontSize: 18, cursor: 'pointer', color: colorText },
                onClick: () => setCollapsed(!collapsed),
              })}
            </Space>

            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push('/dashboard')}
            >
              返回主控台
            </Button>
          </Header>

          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {isAllowed ? (
              children
            ) : (
              <Result
                status="403"
                title="权限不足"
                subTitle="您没有访问此页面的权限，请联系管理员"
                extra={
                  <Button type="primary" onClick={() => router.push('/admin')}>
                    返回系统总览
                  </Button>
                }
              />
            )}
          </Content>
        </Layout>
      </Layout></App>
    </ConfigProvider>
  );
}
