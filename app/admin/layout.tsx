'use client';

import React, { useState } from 'react';
import {
  Layout,
  Menu,
  theme,
  ConfigProvider,
  App,
  Button,
  Space,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
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
  },
  {
    key: '/admin/users',
    icon: <TeamOutlined />,
    label: '用户管理',
  },
  {
    key: '/admin/roles',
    icon: <SafetyOutlined />,
    label: '角色管理',
  },
  {
    key: '/admin/menus',
    icon: <MenuOutlined />,
    label: '菜单权限管理',
  },
];

function getSelectedKey(pathname: string): string {
  if (pathname === '/admin') return '/admin';
  if (pathname.startsWith('/admin/users')) return '/admin/users';
  if (pathname.startsWith('/admin/roles')) return '/admin/roles';
  if (pathname.startsWith('/admin/menus')) return '/admin/menus';
  return '/admin';
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, colorText, colorBorderSecondary },
  } = theme.useToken();
  const pathname = usePathname();
  const router = useRouter();

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
            items={menuItems.map((item) => ({
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
            {children}
          </Content>
        </Layout>
      </Layout></App>
    </ConfigProvider>
  );
}
