'use client';

import React from 'react';
import { Result } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';

export default function RoleDetailPage() {
  const params = useParams();
  
  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        角色详情
      </h1>
      <Result
        icon={<SafetyOutlined />}
        title={`角色 ID: ${params.id}`}
        subTitle="此功能正在开发中..."
      />
    </div>
  );
}
