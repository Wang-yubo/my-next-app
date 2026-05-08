'use client';

import React from 'react';
import { Card, Row, Col, Descriptions, Tag, Typography, Space } from 'antd';
import {
  TeamOutlined,
  SafetyOutlined,
  CompassOutlined,
  MonitorOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Text } = Typography;

const modules = [
  {
    title: '用户管理',
    description: '管理系统中的所有用户账号，支持创建、编辑、启用/禁用、重置密码等操作。',
    icon: <TeamOutlined style={{ fontSize: 32, color: '#1677ff' }} />,
    color: '#e6f4ff',
    href: '/admin/users',
  },
  {
    title: '权限管理',
    description: '管理角色和菜单权限，创建角色并为每个角色分配页面级别的访问权限。',
    icon: <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    color: '#f6ffed',
    href: '/admin/permissions',
  },
  {
    title: '系统监控',
    description: '监控系统用户活动，追踪登录/登出记录，查看操作日志详情。',
    icon: <MonitorOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    color: '#f9f0ff',
    href: '/admin/monitor',
  },
  {
    title: '使用引导',
    description: '本系统采用 RBAC 权限模型，建议按照「权限管理 → 用户」的顺序进行初始配置。',
    icon: <CompassOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    color: '#fffbe6',
    href: undefined,
  },
];

const rbacSteps = [
  {
    step: 1,
    title: '配置角色与权限',
    desc: '在「权限管理」中创建角色（如：超级管理员、教务管理员），并通过树形选择器勾选对应的页面权限。',
    link: '/admin/permissions',
  },
  {
    step: 2,
    title: '创建用户并关联角色',
    desc: '在「用户管理」中创建系统用户，填写基本信息并选择一个角色，用户即获得该角色的所有页面访问权限。',
    link: '/admin/users',
  },
];

const systemInfo = [
  { label: '前端框架', value: 'Next.js 16.2.3 / React 19.2.4' },
  { label: 'UI 组件库', value: 'Ant Design 6.3.5' },
  { label: '数据库', value: 'MongoDB + Mongoose' },
  { label: '认证方式', value: 'JWT (HttpOnly Cookie)' },
  { label: '运行环境', value: process.env.NODE_ENV || 'development' },
];

export default function AdminPage() {
  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        系统总览
      </h1>

      <Row gutter={[16, 16]}>
        {modules.map((mod) => {
          const card = (
            <Card
              hoverable={mod.href !== undefined}
              styles={{
                body: { padding: 24 },
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: mod.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {mod.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: 8,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  >
                    {mod.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: '#666',
                      lineHeight: 1.7,
                    }}
                  >
                    {mod.description}
                  </p>
                </div>
              </div>
            </Card>
          );

          if (mod.href) {
            return (
              <Col xs={24} lg={12} key={mod.title}>
                <Link href={mod.href} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {card}
                </Link>
              </Col>
            );
          }

          return (
            <Col xs={24} lg={12} key={mod.title}>
              {card}
            </Col>
          );
        })}
      </Row>

      <Card
        title={
          <Space>
            <SafetyOutlined style={{ color: '#1677ff' }} />
            <span>权限体系说明</span>
          </Space>
        }
        style={{ marginTop: 24 }}
      >
        <Text
          style={{
            display: 'block',
            marginBottom: 20,
            color: '#666',
            lineHeight: 1.8,
          }}
        >
          本系统采用 <Tag color="blue">RBAC</Tag>（基于角色的访问控制）权限模型，通过「用户 → 角色 → 权限」三层关联实现灵活的权限管理。
          建议按照以下顺序进行初始配置：
        </Text>

        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {rbacSteps.map((item) => (
            <Link
              key={item.step}
              href={item.link}
              style={{
                flex: 1,
                minWidth: 200,
                textDecoration: 'none',
              }}
            >
              <Card
                size="small"
                hoverable
                styles={{
                  body: { padding: 16 },
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: '#1677ff',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>
                  <strong style={{ fontSize: 14, color: '#262626' }}>
                    {item.title}
                  </strong>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: '#666',
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Card>

      <Card
        title={
          <Space>
            <CompassOutlined style={{ color: '#1677ff' }} />
            <span>系统信息</span>
          </Space>
        }
        style={{ marginTop: 16 }}
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small">
          {systemInfo.map((item) => (
            <Descriptions.Item key={item.label} label={<Text type="secondary">{item.label}</Text>}>
              <Text>{item.value}</Text>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    </div>
  );
}
