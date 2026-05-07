'use client';

import React from 'react';
import { Result } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';

export default function UserDetailPage() {
  const params = useParams();
  
  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        用户详情
      </h1>
      <Result
        icon={<UserOutlined />}
        title={`用户 ID: ${params.id}`}
        subTitle="此功能正在开发中..."
      />
    </div>
  );
}
