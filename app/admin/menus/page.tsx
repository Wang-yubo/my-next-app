'use client';

import React from 'react';
import { Result } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

export default function MenusPage() {
  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        菜单权限管理
      </h1>
      <Result
        icon={<MenuOutlined />}
        title="菜单权限管理"
        subTitle="此功能正在开发中..."
      />
    </div>
  );
}
