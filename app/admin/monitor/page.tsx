'use client';

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Select,
  Input,
} from 'antd';
import {
  LoginOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  AuditOutlined,
  RiseOutlined,
  TeamOutlined,
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

const statCards = [
  {
    key: 'todayLogin',
    title: '今日登录',
    value: 0,
    icon: <LoginOutlined />,
    gradient: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)',
    shadow: '0 8px 24px rgba(82, 196, 26, 0.25)',
    suffix: '次',
  },
  {
    key: 'todayLogout',
    title: '今日登出',
    value: 0,
    icon: <LogoutOutlined />,
    gradient: 'linear-gradient(135deg, #faad14 0%, #d48806 100%)',
    shadow: '0 8px 24px rgba(250, 173, 20, 0.25)',
    suffix: '次',
  },
  {
    key: 'totalLogs',
    title: '历史记录',
    value: 0,
    icon: <AuditOutlined />,
    gradient: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
    shadow: '0 8px 24px rgba(22, 119, 255, 0.25)',
    suffix: '条',
  },
  {
    key: 'lastLoginTime',
    title: '最近登录',
    value: '-',
    icon: <ClockCircleOutlined />,
    gradient: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
    shadow: '0 8px 24px rgba(114, 46, 209, 0.25)',
    suffix: '',
    extra: '',
  },
];

export default function MonitorPage() {
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

  const getCardValue = (key: string, card: typeof statCards[0]) => {
    if (key === 'todayLogin') return statsData?.todayLogin ?? 0;
    if (key === 'todayLogout') return statsData?.todayLogout ?? 0;
    if (key === 'totalLogs') return statsData?.totalLogs ?? 0;
    if (key === 'lastLoginTime') {
      if (!statsData?.lastLoginAt) return '-';
      return dayjs(statsData.lastLoginAt).format('HH:mm:ss');
    }
    return card.value;
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
        系统监控
      </h1>

      <Row gutter={[20, 20]}>
        {statCards.map((card) => {
          const value = getCardValue(card.key, card);
          return (
            <Col xs={24} sm={12} lg={6} key={card.key}>
              <div
                style={{
                  background: card.gradient,
                  borderRadius: 16,
                  padding: '24px 20px',
                  boxShadow: card.shadow,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = card.shadow.replace('0 8px', '0 12px');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = card.shadow;
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 10,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {card.title}
                  </span>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      color: '#fff',
                    }}
                  >
                    {card.icon}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 4,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: 34,
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </span>
                  {card.suffix && (
                    <span
                      style={{
                        fontSize: 15,
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginLeft: 2,
                      }}
                    >
                      {card.suffix}
                    </span>
                  )}
                  {card.key === 'todayLogin' && (
                    <Tag
                      style={{
                        marginLeft: 8,
                        borderRadius: 8,
                        border: 'none',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        fontSize: 12,
                        lineHeight: '20px',
                      }}
                      icon={<RiseOutlined />}
                    >
                      今日
                    </Tag>
                  )}
                </div>

                {card.key === 'lastLoginTime' && statsData?.lastLoginUser && (
                  <div
                    style={{
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <TeamOutlined style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 13 }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 13 }}>
                      用户：{statsData.lastLoginUser.name}
                    </span>
                  </div>
                )}

                {card.key !== 'lastLoginTime' && (
                  <div
                    style={{
                      marginTop: 10,
                      height: 3,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      zIndex: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '60%',
                        height: '100%',
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.4)',
                      }}
                    />
                  </div>
                )}
              </div>
            </Col>
          );
        })}
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
