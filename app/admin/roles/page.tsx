'use client';

import React from 'react';
import { Result } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

export default function RolesPage() {
  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        角色管理
      </h1>
      <Result
        icon={<SafetyOutlined />}
        title="角色管理"
        subTitle="此功能正在开发中..."
      />
    </div>
  );
}
