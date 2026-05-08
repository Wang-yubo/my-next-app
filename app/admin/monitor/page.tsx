'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  Select,
  Input,
  theme,
} from 'antd';
import {
  LoginOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  AuditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { get } from '@/lib/request';

const { Search } = Input;

interface ActivityLogRecord {
  _id: string;
  userId: string;
  username: string;
  name: string;
  role: string;
  action: 'login' | 'logout';
  ip: string;
  userAgent: string;
  createdAt: string;
}

const roleColorMap: Record<string, string> = {
  admin: 'red',
  teacher: 'green',
  student: 'default',
};

export default function MonitorPage() {
  const { token } = theme.useToken();
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const { data: statsData } = useRequest(
    async () => {
      const result = await get('/api/admin/monitor/stats');
      return result.data;
    },
    { manual: false, defaultParams: [] }
  );

  const { data: logsData, loading: logsLoading, run: fetchLogs } = useRequest(
    async (params: any = {}) => {
      const { page = 1, pageSize = 20, search = '', action = '' } = params;
      const result = await get('/api/admin/monitor/logs', {
        params: { page, pageSize, search, action },
      });
      return result;
    },
    {
      manual: false,
      onSuccess: (result) => {
        setPagination({
          current: result.page || 1,
          pageSize: result.pageSize || 20,
          total: result.total || 0,
        });
      },
      defaultParams: [{ page: 1, pageSize: 20, search: '', action: '' }],
    }
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchLogs({ page: 1, pageSize: pagination.pageSize, search: value, action: actionFilter });
  };

  const handleActionChange = (value: string) => {
    setActionFilter(value);
    fetchLogs({ page: 1, pageSize: pagination.pageSize, search: searchText, action: value });
  };

  const handleTableChange = (newPagination: any) => {
    fetchLogs({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      search: searchText,
      action: actionFilter,
    });
  };

  const columns: ColumnsType<ActivityLogRecord> = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => (
        <span>{dayjs(date).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      width: 140,
    },
    {
      title: '类型',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={roleColorMap[role] || 'default'}>
          {role === 'admin' ? '管理员' : role === 'teacher' ? '教师' : '学生'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 90,
      render: (action: string) => (
        <Tag
          color={action === 'login' ? 'green' : 'default'}
          icon={action === 'login' ? <LoginOutlined /> : <LogoutOutlined />}
        >
          {action === 'login' ? '登录' : '登出'}
        </Tag>
      ),
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 160,
      render: (ip: string) => ip || '-',
    },
    {
      title: '设备信息',
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: true,
      render: (ua: string) => {
        if (!ua) return '-';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edg')) return 'Edge';
        return ua.substring(0, 60);
      },
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        系统监控
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
            <Statistic
              title={
                <Space>
                  <LoginOutlined style={{ color: '#52c41a' }} />
                  <span>今日登录</span>
                </Space>
              }
              value={statsData?.todayLogin || 0}
              valueStyle={{ color: '#52c41a', fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
            <Statistic
              title={
                <Space>
                  <LogoutOutlined style={{ color: '#999' }} />
                  <span>今日登出</span>
                </Space>
              }
              value={statsData?.todayLogout || 0}
              valueStyle={{ fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
            <Statistic
              title={
                <Space>
                  <AuditOutlined style={{ color: '#1677ff' }} />
                  <span>历史记录总数</span>
                </Space>
              }
              value={statsData?.totalLogs || 0}
              valueStyle={{ color: '#1677ff', fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable styles={{ body: { padding: '24px 16px' } }}>
            <Statistic
              title={
                <Space>
                  <ClockCircleOutlined style={{ color: '#faad14' }} />
                  <span>最近登录</span>
                </Space>
              }
              value={statsData?.lastLoginAt ? dayjs(statsData.lastLoginAt).format('HH:mm:ss') : '-'}
              valueStyle={{ color: '#faad14', fontSize: 28 }}
              suffix={
                statsData?.lastLoginUser ? (
                  <Tag color={roleColorMap[statsData.lastLoginUser.role] || 'default'} style={{ marginLeft: 8 }}>
                    {statsData.lastLoginUser.name}
                  </Tag>
                ) : undefined
              }
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Search
            placeholder="搜索用户名"
            allowClear
            onSearch={handleSearch}
            style={{ maxWidth: 280 }}
          />
          <Select
            placeholder="操作类型"
            allowClear
            style={{ width: 130 }}
            value={actionFilter || undefined}
            onChange={handleActionChange}
            options={[
              { label: '登录', value: 'login' },
              { label: '登出', value: 'logout' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={logsData?.data || []}
          rowKey="_id"
          loading={logsLoading}
          scroll={{ x: 900 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
}
