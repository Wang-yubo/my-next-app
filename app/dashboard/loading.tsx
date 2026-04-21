'use client';

import React from 'react';
import { Layout, Skeleton } from 'antd';

const { Header, Sider, Content, Footer } = Layout;

export default function LoadingSkeleton() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 侧边栏骨架 */}
      <Sider
        theme="light"
        width={200}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        {/* Logo 区域骨架 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Skeleton.Input active size="small" style={{ width: 100, height: 24 }} />
        </div>

        {/* 菜单骨架 */}
        <div style={{ padding: '16px 0' }}>
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </div>
      </Sider>

      {/* 主内容区域 */}
      <Layout>
        {/* 顶部导航骨架 */}
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {/* 左侧：面包屑骨架 */}
          <Skeleton.Input active size="small" style={{ width: 150, height: 20 }} />

          {/* 右侧：用户信息骨架 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Skeleton.Button active size="small" style={{ width: 60, height: 32 }} />
            <Skeleton.Avatar active size="small" />
            <Skeleton.Input active size="small" style={{ width: 60, height: 20 }} />
          </div>
        </Header>

        {/* 内容区域骨架 */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          <Skeleton active paragraph={{ rows: 8 }} />
        </Content>

        {/* 底部骨架 */}
        <Footer
          style={{
            textAlign: 'center',
            color: '#999',
          }}
        >
          <Skeleton.Input active size="small" style={{ width: 200, height: 16 }} />
        </Footer>
      </Layout>
    </Layout>
  );
}
