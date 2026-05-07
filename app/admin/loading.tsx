'use client';

import React from 'react';
import { Layout, Skeleton } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function AdminLoadingSkeleton() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider
        theme="light"
        width={200}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <SettingOutlined style={{ fontSize: 20, color: '#1677ff', marginRight: 8 }} />
          <Skeleton.Input active size="small" style={{ width: 80, height: 22 }} />
        </div>

        <div style={{ padding: '16px 0' }}>
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </div>
      </Sider>

      <Layout>
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
          <Skeleton.Button active size="small" style={{ width: 32, height: 32 }} />

          <Skeleton.Button active size="small" style={{ width: 100, height: 32 }} />
        </Header>

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
      </Layout>
    </Layout>
  );
}
