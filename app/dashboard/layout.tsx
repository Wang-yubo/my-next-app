'use client';

import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  Space,
  Breadcrumb,
  ConfigProvider,
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  ApiOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from './theme-switcher';
import LoadingSkeleton from './loading';

const { Header, Sider, Content, Footer } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1677ff');
  const [isClient, setIsClient] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, colorText, colorBorderSecondary, colorTextSecondary },
  } = theme.useToken();

  const pathname = usePathname();

  // 客户端水合后立即读取主题色
  useEffect(() => {
    setIsClient(true);
    const savedColor = localStorage.getItem('theme-color');
    if (savedColor) {
      setPrimaryColor(savedColor);
    }
  }, []);

  // 处理主题色变化
  const handleThemeChange = (color: string) => {
    setPrimaryColor(color);
  };

  // 菜单配置 - 统一管理路由和标题
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      href: '/dashboard',
    },
    {
      key: '/dashboard/students',
      icon: <TeamOutlined />,
      label: '学生管理',
      href: '/dashboard/students',
    },
    {
      key: '/dashboard/courses',
      icon: <BookOutlined />,
      label: '课程管理',
      href: '/dashboard/courses',
    },
    {
      type: 'divider',
    },
    {
      key: '/api-doc',
      icon: <ApiOutlined />,
      label: 'API 文档',
      href: '/api-doc',
      target: '_blank',
    },
  ];

  // 根据当前路径获取面包屑标题
  const getBreadcrumbTitle = () => {
    const currentItem = menuItems.find(item => item.key === pathname);
    return currentItem?.label || '未知';
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 在主题色加载完成前显示骨架屏，避免闪烁
  if (!isClient) {
    return <LoadingSkeleton />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          background: colorBgContainer,
        }}
      >
        {/* Logo 区域 */}
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
            <DashboardOutlined style={{ fontSize: 24, color: primaryColor }} />
          ) : (
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: primaryColor,
              }}
            >
              管理系统
            </h1>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems.map(item => 
            item.type === 'divider' ? item : {
              ...item,
              label: <Link href={item.href!} target={item.target}>{item.label}</Link>
            }
          )}
          style={{
            borderRight: 0,
            marginTop: 8,
          }}
        />
      </Sider>

      {/* 主内容区域 */}
      <Layout>
        {/* 顶部导航 */}
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
          {/* 左侧：折叠按钮 + 面包屑 */}
          <Space size="middle">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              style: { fontSize: 18, cursor: 'pointer', color: colorText },
              onClick: () => setCollapsed(!collapsed),
            })}
            <Breadcrumb
              items={[
                { title: '首页' },
                { title: getBreadcrumbTitle() },
              ]}
            />
          </Space>

          {/* 右侧：主题切换 + 用户信息 */}
          <Space size="middle">
            <ThemeSwitcher 
              onThemeChange={handleThemeChange}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer', color: colorText }}>
                <Avatar
                  style={{ backgroundColor: primaryColor }}
                  icon={<UserOutlined />}
                />
                <span>管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            color: colorText,
          }}
        >
          {children}
        </Content>

        {/* 底部 */}
        <Footer
          style={{
            textAlign: 'center',
            color: colorTextSecondary,
          }}
        >
          学生信息管理系统 ©{new Date().getFullYear()} Created with Ant Design
        </Footer>
      </Layout>
    </Layout>
    </ConfigProvider>
  );
}
