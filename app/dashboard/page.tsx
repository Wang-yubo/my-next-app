'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

export default function DashboardPage() {
  const statistics = [
    {
      title: '学生总数',
      value: 1234,
      icon: <TeamOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
      color: '#e6f4ff',
    },
    {
      title: '课程总数',
      value: 56,
      icon: <BookOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
      color: '#f6ffed',
    },
    {
      title: '优秀率',
      value: 85.6,
      precision: 1,
      suffix: '%',
      icon: <TrophyOutlined style={{ fontSize: 28, color: '#faad14' }} />,
      color: '#fffbe6',
    },
    {
      title: '通过率',
      value: 92.3,
      precision: 1,
      suffix: '%',
      icon: <CheckCircleOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
      color: '#f9f0ff',
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        仪表盘
      </h1>

      <Row gutter={[16, 16]}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              styles={{
                body: { padding: '24px 16px' },
              }}
            >
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {stat.icon}
                    <span>{stat.title}</span>
                  </div>
                }
                value={stat.value}
                precision={stat.precision}
                suffix={stat.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        title="欢迎使用学生信息管理系统"
        style={{ marginTop: 24 }}
        hoverable
      >
        <p style={{ color: '#666', lineHeight: 1.8 }}>
          这是一个基于 Next.js 和 Ant Design 构建的后台管理系统。
          你可以在左侧菜单中导航到不同的功能模块。
        </p>
      </Card>
    </div>
  );
}
