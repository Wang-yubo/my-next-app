'use client';

import React from 'react';
import { Result } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

export default function AdminPage() {
  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        系统设置
      </h1>
      <Result
        icon={<SettingOutlined />}
        title="系统管理中心"
        subTitle="在这里管理用户、角色和菜单权限"
      />
    </div>
  );
}
