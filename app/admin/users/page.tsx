'use client';

import React from 'react';
import { Result } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

export default function UsersPage() {
  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        用户管理
      </h1>
      <Result
        icon={<TeamOutlined />}
        title="用户管理"
        subTitle="此功能正在开发中..."
      />
    </div>
  );
}
